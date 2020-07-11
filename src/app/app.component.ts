import { Component, OnInit } from '@angular/core';
import { CellData, CellStatus } from '../cellData';
import { BlockPlacmentResult } from '../blockPlacementResult';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  template: `
        <row #row
            [rowData]="rowData"
            [editable]="true">
        </row>

        <row *ngFor="let row of displayRows"
            [rowData]="row"
            [editable]="false"
            [similarities]="similarities">
        </row>

        <button (click)="calc(row.numbers, row.rowData)">CALC</button>
  `
})
export class AppComponent implements OnInit{

    rowData: CellData[] = [];
    displayRows: CellData[][] = [];
    similarities: number[] = [];

    ngOnInit()
    {
        // test
        for(let i = 0; i < 5; i++)
            this.rowData.push(new CellData());
    }

    calc(blocks: number[], rowData: CellData[])
    {
        this.displayRows = [];

        blocks = blocks.filter(val => val > 0);

        let results: BlockPlacmentResult[] = [new BlockPlacmentResult(rowData, 0)];
        for(let i = 0; i < blocks.length; i++)
            results = this.findPositionsForBlock(blocks, i, results);

        const numCellsRequired = blocks.reduce((accumulator, currentValue) => accumulator + currentValue);
        results = results.filter(result => result.numCellsFilled == numCellsRequired);
        results = results.filter(result => this.checkAllBlocksSeperatedByCrosses(result, blocks));

        results.forEach(result => this.displayRows.push(result.testRow));
        //results.forEach(res => this.displayRows.push(this.fillEmptyTilesWithCrosses(res.testRow)));

        this.similarities = this.findSimilarities(results);
        console.log(this.similarities);
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

    findSimilarities(results: BlockPlacmentResult[]): number[]
    {
        const similarities: number[] = [];
        for(let i = 0; i < results[0].testRow.length; i++)
        {
            if(results[0].testRow[i].isHard)
                continue;

            let same = true;

            results.forEach(result1 => {
                if(!same)
                {
                    return;
                }
                results.forEach(result2 => {
                    if(result1.testRow[i].status != result2.testRow[i].status)
                    {
                        same = false;
                        return;
                    }
                })
            })

            if(same)
                similarities.push(i);
        }

        return similarities;
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
