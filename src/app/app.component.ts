import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { CellData, CellStatus } from '../cellData';
import { BlockPlacmentResult } from '../blockPlacementResult';
import { RowData } from '../rowData';
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

        <div *ngFor="let resultMatrix of resultMatrices, let i = index">
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

    resultMatrices: RowData[][] = [];

    @ViewChildren('columnInput') columnInputs: QueryList<CollumnRowInputComponent>;
    @ViewChildren('rowInput') rowInputs: QueryList<CollumnRowInputComponent>;

    ngOnInit()
    {
        //allBlocksPresent(testRow: CellData[], blocks: number[]):
        // let testRow = [new CellData(), new CellData(), new CellData(), new CellData(), new CellData()];
        // let blocks = [0];
        // console.log(this.allBlocksPresent(testRow, blocks));
    }

    btnCreateClicked(dimensions: number[])
    {
        // this.rowDatas = Array.apply(null, Array(dimensions[1])).map(
        //     (value, i1) => Array[i1] = Array.apply(null, Array(dimensions[1])).map(
        //         (value, i2) => Array[i2] = new CellData()
        //     )
        // );

        // Array.apply(null, Array(dimensions[1])).map((value, i2) => Array[i2] = new CellData())

        this.matrixX = dimensions[0];
        this.matrixY = dimensions[1];
        this.rowDatas = Array.apply(null, Array(dimensions[0])).map(
            (value, i1) => Array[i1] = new RowData(Array.apply(null, Array(dimensions[1])).map((value, i2) => Array[i2] = new CellData()))
        );

        console.log(this.rowDatas);

        //TODO create columnDatas here
    }

    metaCalc()
    {
        this.columnInputs.forEach(i => console.log(i.numbers));
        this.rowInputs.forEach(i => console.log(i.numbers));

        const rowInputsArray = this.rowInputs.toArray();
        const columnInputsArray = this.columnInputs.toArray();

        let rowDatasForCalculcaltion = this.rowDatas;
        let iterationCounter = 0;

        do
        {
            iterationCounter++;
            let resultMatrix: RowData[] = [];
            //first rows
            for(let i = 0; i < this.rowInputs.length; i++)
            {
                const similiarities = this.calc(rowInputsArray[i].numbers, rowDatasForCalculcaltion[i].cellData);
                const rowData = new RowData(similiarities);
                //this.displayRows.push(rowData);
                resultMatrix.push(rowData);
            }
            this.resultMatrices.push(resultMatrix);

            //TODO add check here if riddle is solved already

            //next columns
            //const columns = this.rowDatasToColumnDatas(this.displayRows.slice(Math.max(this.displayRows.length - this.matrixY, 0)));
            const columns = this.rowDatasToColumnDatas(resultMatrix);
            const columnDatas: RowData[] = [];
            for(let i = 0; i < columns.length; i++)
            {
                const similiarities = this.calc(columnInputsArray[i].numbers, columns[i].cellData);
                columnDatas.push( new RowData(similiarities) );
            }
            const rowDatas = this.columnDatasToRowDatas(columnDatas);
            //this.displayRows = this.displayRows.concat(rowDatas);
            this.resultMatrices.push(rowDatas);

            rowDatasForCalculcaltion = rowDatas;

            if(iterationCounter >= 20)
            {
                console.log('iterationCounter reached 20. Aborting metaCalc');
                return;
            }

        }while(!rowDatasForCalculcaltion.every((row, i) => this.allBlocksPresent(row.cellData, rowInputsArray[i].numbers)));

        console.log('Solved after', iterationCounter, 'iterations');
    }

    calc(blocks: number[], rowData: CellData[]): CellData[]
    {
        let results: BlockPlacmentResult[] = [new BlockPlacmentResult(rowData, 0)];
        for(let i = 0; i < blocks.length; i++)
            results = this.findPositionsForBlock(blocks, i, results);

        const numCellsRequired = blocks.reduce((accumulator, currentValue) => accumulator + currentValue);
        results = results.filter(result => result.numCellsFilled == numCellsRequired);
        results = results.filter(result => this.checkAllBlocksSeperatedByCrosses(result, blocks));

        if(results.length == 0)
        {
            console.error('No results found for blocks', blocks, 'and rowData', rowData);
            return;
        }

        const similarities = this.findSimilarities(results);
        //console.log('similiarities', similarities);
        return similarities;
    }

    similiaritiesToRowData(similarities: number[]): RowData
    {
        //TODO find switch between matrixX and matrixY for RowData constructor argument
        if(similarities.length > 0)
            return new RowData(null, similarities, this.matrixX);
        else
            return new RowData(Array.apply(null, Array(this.matrixX)).map((value, i2) => Array[i2] = new CellData()));

        //TODO add result when blocks is empty or only includes 0's
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

                if(blockIndex < blocks.length -1)
                {
                    hasRoomForOtherBlocks = this.getTestRowHasRoomForOtherBlocks(testRow, blocks, blockIndex, startIndex);
                    if(!hasRoomForOtherBlocks)
                    {
                        break;
                    }
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
        for(let i = 0; i < blocks.length; i++)
        {
            let blockFound = false;
            do{
                if(!testRow[continueAtIndex])
                    return false;

                if(testRow[continueAtIndex].status == CellStatus.filled)
                {
                    let j = 0;
                    do{
                        if(!testRow[continueAtIndex])
                            return false;

                        if(testRow[continueAtIndex].status != CellStatus.filled)
                        {
                            return false;
                        }
                        continueAtIndex++;
                        j++;
                    }while(j < blocks[i]);
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

    checkAllBlocksSeperatedByCrosses(result: BlockPlacmentResult, blocks: number[]): boolean
    {
        const row = result.testRow;
        let continueAtIndex = 0;
        // blocks.forEach(block =>
        // {
        for(const block of blocks)
        {
            let cellsChecked = 0;
            for(let i = continueAtIndex; i < row.length; i++)
            {
                if(row[i].status == CellStatus.filled)
                {
                    cellsChecked++;
                    //continueAtIndex++;
                }
                else
                    continueAtIndex++;
                if(cellsChecked == block)
                    break;
            }

            const cellBeforeBlockOK = row[continueAtIndex - 1] == undefined || row[continueAtIndex - 1].status == CellStatus.cross;
            const cellAfterBlockOK = row[continueAtIndex + block ] == undefined || row[continueAtIndex + block ].status == CellStatus.cross;

            if(!cellBeforeBlockOK || !cellAfterBlockOK)
                return false;

            continueAtIndex += block;
        //});
        }
        return true;
    }

    findSimilarities(results: BlockPlacmentResult[]): CellData[]
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
