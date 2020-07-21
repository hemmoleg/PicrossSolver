import { CellData, CellStatus } from './cellData';
import { BlockPlacmentResult } from './blockPlacementResult';
import { RowData } from './rowData';
import { ResultMatrices } from './resultMatrices';

export class Solver{

    matrixX: number;
    matrixY: number;

    solve(rowInputsArray: number[][], columnInputsArray: number[][]): ResultMatrices
    {
        const resultMatrices: ResultMatrices = new ResultMatrices();

        let iterationCounter = 0;
        let findSimilaritiesInRows = true;
        let resultMatrix: RowData[] = [];
        let cellsFilledOrCrossedCountBefore = 0;

        this.matrixX = columnInputsArray.length;
        this.matrixY = rowInputsArray.length;

        const emptyMatrix = Array.apply(null, Array(columnInputsArray.length)).map(
            (value, i1) => Array[i1] = new RowData(Array.apply(null, Array(rowInputsArray.length)).map((value, i2) => Array[i2] = new CellData()))
        );
        resultMatrices.push(emptyMatrix);

        do
        {
            iterationCounter++;
            if(findSimilaritiesInRows)
            {
                resultMatrix = [];

                //first rows
                for(let i = 0; i < rowInputsArray.length; i++)
                {
                    const similiarities = this.findSimiliarities(rowInputsArray[i], resultMatrices.last()[i].cellData);
                    const rowData = new RowData(similiarities);
                    resultMatrix.push(rowData);
                }
                resultMatrices.push(resultMatrix);
                findSimilaritiesInRows = false;
            }
            else
            {
                //next columns
                const lastResultAsColumns = this.rowDatasToColumnDatas(resultMatrices.last());
                const resultColumnDatas: RowData[] = [];
                for(let i = 0; i < lastResultAsColumns.length; i++)
                {
                    const similiarities = this.findSimiliarities(columnInputsArray[i], lastResultAsColumns[i].cellData);
                    resultColumnDatas.push( new RowData(similiarities) );
                }
                resultMatrix = this.columnDatasToRowDatas(resultColumnDatas);
                resultMatrices.push(resultMatrix);

                findSimilaritiesInRows = true;
            }

            const cellsFilledOrCrossedCount = this.getCellsFilledOrCrossedCount( resultMatrices.last() );
            if(cellsFilledOrCrossedCountBefore >= cellsFilledOrCrossedCount)
            {
                console.error('no new cells were filled in current iterartion. aborting...');
                return;
            }
            cellsFilledOrCrossedCountBefore = cellsFilledOrCrossedCount;

        }while(!resultMatrices.last().every((row, i) => this.allBlocksPresent(row.cellData, rowInputsArray[i])));

        console.log('Solved after', iterationCounter, 'iterations');
        return resultMatrices;
    }

    findSimiliarities(blocks: number[], rowData: CellData[]): CellData[]
    {
        let results: BlockPlacmentResult[] = [new BlockPlacmentResult(rowData, 0)];
        for(let i = 0; i < blocks.length; i++)
            results = this.findPositionsForBlock(blocks, i, results);

        const numCellsRequired = blocks.reduce((accumulator, currentValue) => accumulator + currentValue);
        results = results.filter(result => result.numCellsFilled == numCellsRequired);
        results = results.filter(result => this.allBlocksSeperatedByCrosses(result, blocks));

        if(results.length == 0)
        {
            console.error('No results found for blocks', blocks, 'and rowData', rowData);
            return;
        }

        const similarities = this.getSimilarities(results);
        return similarities;
    }

    findPositionsForBlock(blocks: number[], blockIndex: number, resultsBefore: BlockPlacmentResult[])
    {
        const results: BlockPlacmentResult[] = [];

        let didFit = true;
        let hasRoomForOtherBlocks = true;
        let startIndex = 0;
        let testRow: CellData[];

        for(const result of resultsBefore)
        {
            startIndex = result.continueAtIndex;
            do{
                testRow = [];
                result.testRow.forEach(val => testRow.push(Object.assign({}, val)));

                didFit = this.putBlockInTestRow(blocks[blockIndex], startIndex, testRow);

                if(didFit)
                {
                    //place cross BEFORE block
                    if(testRow[startIndex - 1] && !testRow[startIndex - 1].isHard)
                        testRow[startIndex - 1].status = CellStatus.cross;

                    //place cross AFTER block
                    if(testRow[startIndex + blocks[blockIndex]] && !testRow[startIndex + blocks[blockIndex]].isHard)
                        testRow[startIndex + blocks[blockIndex]].status = CellStatus.cross;

                    if(this.allBlocksPresent(testRow, blocks))
                    {
                        testRow = this.fillEmptyTilesWithCrosses(testRow);
                        results.push(new BlockPlacmentResult(testRow, startIndex + blocks[blockIndex] + 1));
                        startIndex++;
                        continue;
                    }

                    results.push(new BlockPlacmentResult(testRow, startIndex + blocks[blockIndex] + 1));
                }

                if(blockIndex < blocks.length - 1)
                {
                    hasRoomForOtherBlocks = this.getTestRowHasRoomForOtherBlocks(testRow, blocks, blockIndex, startIndex);
                    if(!hasRoomForOtherBlocks)
                        break;
                }

                startIndex++;
            }while((didFit || hasRoomForOtherBlocks) && startIndex < testRow.length);
        }

        return results;
    }

    putBlockInTestRow(block: number, startIndex: number, testRow: CellData[]): boolean
    {
        let i = 0;
        for(i; i < block; i++)
        {
            //check if i + startIndex exists
            //check if i + startIndex is empty
            //OR check if i + startIndex is filles and isHard
            if(testRow[i + startIndex] &&
                (testRow[i + startIndex].status == CellStatus.empty ||
                    (testRow[i + startIndex].status == CellStatus.filled && testRow[i + startIndex].isHard)
                )
            )
            {
                testRow[i + startIndex].status = CellStatus.filled;
            }
            else
            {
                return false;
            }
        }
        return true;
    }

    getTestRowHasRoomForOtherBlocks(testRow: CellData[], blocks: number[], blockIndex: number, startIndex: number): boolean
    {
        let leastTilesNeededForRest = 0;
        for(let j = blockIndex + 1; j < blocks.length; j++)
        {
            leastTilesNeededForRest += blocks[j];
            if(j < blocks.length - 1)
                leastTilesNeededForRest++;
        }

        if(leastTilesNeededForRest < testRow.length - (blocks[blockIndex] + startIndex))
            return true;
        else
            return false;

    }

    allBlocksPresent(testRow: CellData[], blocks: number[]): boolean
    {
        if(0 == blocks.reduce((accumulator, currentValue) => accumulator + currentValue))
            return true;

        let continueAtIndex = 0;
        //for(let i = 0; i < blocks.length; i++)
        for(const blockLength of blocks)
        {
            let blockFound = false;
            do{
                if(!testRow[continueAtIndex])
                    return false;

                if(testRow[continueAtIndex].status == CellStatus.filled)
                {
                    //let j = 0;
                    //do{
                    for(let j = 0; j < blockLength; j++)
                    {
                        if(!testRow[continueAtIndex] ||
                            testRow[continueAtIndex].status != CellStatus.filled)
                            return false;

                        continueAtIndex++;
                        //j++;
                    }//while(j < block);
                    blockFound = true;
                }
                else
                {
                    continueAtIndex++;
                }
            }while(!blockFound);
        }
        return true;
    }

    allBlocksSeperatedByCrosses(result: BlockPlacmentResult, blocks: number[]): boolean
    {
        const row = result.testRow;
        let indexOfFirstCellOfBlock = 0;

        for(const blockLength of blocks)
        {
            let cellsChecked = 0;
            for(let i = indexOfFirstCellOfBlock; i < row.length; i++)
            {
                if(row[i].status == CellStatus.filled)
                {
                    cellsChecked++;
                }
                else
                    indexOfFirstCellOfBlock++;

                if(cellsChecked == blockLength)
                    break;
            }

            const cellBeforeBlockOK = row[indexOfFirstCellOfBlock - 1] == undefined || row[indexOfFirstCellOfBlock - 1].status == CellStatus.cross;
            const cellAfterBlockOK = row[indexOfFirstCellOfBlock + blockLength ] == undefined || row[indexOfFirstCellOfBlock + blockLength ].status == CellStatus.cross;

            if(!cellBeforeBlockOK || !cellAfterBlockOK)
                return false;

            indexOfFirstCellOfBlock += blockLength;
        }
        return true;
    }

    getSimilarities(results: BlockPlacmentResult[]): CellData[]
    {
        const similarities: CellData[] = [];

        for(let i = 0; i < results[0].testRow.length; i++)
        {
            let cellStatus: CellStatus;
            results.forEach(result => {
                if(cellStatus == null)
                    cellStatus = result.testRow[i].status;
                else if(cellStatus != result.testRow[i].status)
                    cellStatus = CellStatus.empty;
            });
            const cd = new CellData();
            cd.status = cellStatus;
            cd.isHard = cellStatus != CellStatus.empty;
            similarities.push(cd);
        }

        return similarities;
    }

    getCellsFilledOrCrossedCount(rowData: RowData[])
    {
        let cellsFilledOrCrossed = 0;
        rowData.forEach(row => cellsFilledOrCrossed += row.getCellsFilledOrCrossedCount());
        return cellsFilledOrCrossed;
    }

    rowDatasToColumnDatas(rowDatas: RowData[]): RowData[]
    {
        const columns: RowData[] = [];
        for(let i = 0; i < this.matrixX; i++)
        {
            columns.push(new RowData());
            for(let j = 0; j < this.matrixY; j++)
            {
                columns[columns.length - 1].cellData[j] = rowDatas[j].cellData[i];
            }
        }
        console.log('resultsToColumns', columns);
        return columns;
    }

    columnDatasToRowDatas(columnDatas: RowData[]): RowData[]
    {
        const rows: RowData[] = [];
        for(let i = 0; i < this.matrixX; i++)
        {
            rows.push(new RowData());
            for(let j = 0; j < this.matrixY; j++)
            {
                rows[rows.length - 1].cellData[j] = columnDatas[j].cellData[i];
            }
        }
        console.log('resultsToColumns', rows);
        return rows;
    }

    fillEmptyTilesWithCrosses(rowData: CellData[]): CellData[]
    {
        rowData.forEach(val => val.status == CellStatus.empty ? val.status = CellStatus.cross : val.status);
        return rowData;
    }

}
