import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { CellData, CellStatus } from '../cellData';
import { BlockPlacmentResult } from '../blockPlacementResult';
import { RowData } from '../rowData';
import { ResultMatrices } from '../resultMatrices';
import { CollumnRowInputComponent } from './collumn-row-input/collumn-row-input.component';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss', './cell/cell.component.scss'],
  template: `
        <matrixinput
            (btnCreateClicked)="btnCreateClicked($event)">
        </matrixinput>

        <!-- <cell></cell>

        <div>
            <div id="cell">
            </div>
        </div> -->

        <!-- <row #row *ngFor="let rowData of rowDatas"
            [rowData]="rowData"
            [editable]="true">
        </row> -->
        <!-- <column-input *ngFor="let item of rowDatas[0]"
            [isColumn]="true">
        </column-input>
        <br> -->

        <!-- <div id="flex2">
            <div id="topLeft">
            </div>
            <div id="topRight">
                <div>
                    <column-input *ngFor="let item of rowDatas[0]"
                        [isColumn]="true">
                    </column-input>
                </div>
            </div>
            <div id="botLeft">
                <div *ngFor="let item of rowDatas">
                    <column-input
                        [isColumn]="false">
                    </column-input>
                    <br>
                </div>
            </div>
            <div id="botRight">
            </div>
        </div> -->

        <div style="text-align: center">
            <div *ngIf="rowDatas.length > 0" id="flex">
                <div id="topLeftDiv" class="flexChild">
                </div>
                <div id="topRightDiv" class="flexChild">
                    <column-row-input #columnInput
                        *ngFor="let item of rowDatas[0].cellData; let i = index;"
                        [isColumn]="true"
                        [index]="i">
                    </column-row-input>
                </div>
                <div id="botLeftDiv" class="flexChild">
                    <div *ngFor="let item of rowDatas; let i = index;">
                        <column-row-input #rowInput
                            [isColumn]="false"
                            [index]="i">
                        </column-row-input>
                    </div>
                </div>
                <div class="flexChild">
                    <matrix
                        [rowDatas]="rowDatas"
                        [isEditable]="true">
                    </matrix>
                </div>
            </div>
        </div>

        <button (click)="metaCalc()">CALC</button>

        <div *ngFor="let resultMatrix of resultMatrices.resultMatrices | slice: 1, let i = index">
            Iteration: {{i+1}}
            <matrix
                [rowDatas]="resultMatrix"
                [isEditable]="true"
                [isResult]="true">
            </matrix>
        </div>
  `
})
export class AppComponent implements OnInit{

    matrixX: number;
    matrixY: number;
    rowDatas: RowData[] = [];
    displayRows: RowData[] = [];

    //resultMatrices: RowData[][] = [];
    resultMatrices: ResultMatrices = new ResultMatrices();

    @ViewChildren('columnInput') columnInputs: QueryList<CollumnRowInputComponent>;
    @ViewChildren('rowInput') rowInputs: QueryList<CollumnRowInputComponent>;

    ngOnInit()
    {
    }

    btnCreateClicked(dimensions: number[])
    {
        this.matrixX = dimensions[0];
        this.matrixY = dimensions[1];
        this.rowDatas = Array.apply(null, Array(dimensions[0])).map(
            (value, i1) => Array[i1] = new RowData(Array.apply(null, Array(dimensions[1])).map((value, i2) => Array[i2] = new CellData()))
        );

        console.log(this.rowDatas);
    }

    metaCalc()
    {
        const rowInputsArray = this.rowInputs.toArray();
        const columnInputsArray = this.columnInputs.toArray();

        let iterationCounter = 0;
        let findSimilaritiesInRows = true;
        let resultMatrix: RowData[] = [];
        let cellsFilledOrCrossedCountBefore = 0;

        this.resultMatrices.push(this.rowDatas);

        do
        {
            iterationCounter++;
            if(findSimilaritiesInRows)
            {
                resultMatrix = [];

                //first rows
                for(let i = 0; i < this.rowInputs.length; i++)
                {
                    const similiarities = this.findSimiliarities(rowInputsArray[i].numbers, this.resultMatrices.last()[i].cellData);
                    const rowData = new RowData(similiarities);
                    resultMatrix.push(rowData);
                }
                this.resultMatrices.push(resultMatrix);
                findSimilaritiesInRows = false;
            }
            else
            {
                //next columns
                const lastResultAsColumns = this.rowDatasToColumnDatas(this.resultMatrices.last());
                const resultColumnDatas: RowData[] = [];
                for(let i = 0; i < lastResultAsColumns.length; i++)
                {
                    const similiarities = this.findSimiliarities(columnInputsArray[i].numbers, lastResultAsColumns[i].cellData);
                    resultColumnDatas.push( new RowData(similiarities) );
                }
                resultMatrix = this.columnDatasToRowDatas(resultColumnDatas);
                this.resultMatrices.push(resultMatrix);

                findSimilaritiesInRows = true;
            }

            const cellsFilledOrCrossedCount = this.getCellsFilledOrCrossedCount( this.resultMatrices.last() );
            if(cellsFilledOrCrossedCountBefore >= cellsFilledOrCrossedCount)
            {
                console.error('no new cells were filled in current iterartion. aborting...');
                return;
            }
            cellsFilledOrCrossedCountBefore = cellsFilledOrCrossedCount;

        }while(!this.resultMatrices.last().every((row, i) => this.allBlocksPresent(row.cellData, rowInputsArray[i].numbers)));

        console.log('Solved after', iterationCounter, 'iterations');
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

    async delay(ms: number)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
