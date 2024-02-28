import React, { useState, useEffect } from 'react';
import { DataTable } from 'react-native-paper';
import {DataTableProps} from "../../interfaces/data-table-props";
import { StyleSheet } from 'react-native';

const DataTableComponent: React.FC<DataTableProps> = ({ data }: DataTableProps) => {
    const dataArray = Array.isArray(data) ? data : [data];
    const keys = Object.keys(dataArray[0]);

    const [page, setPage] = useState<number>(0);
    const [numberOfItemsPerPageList] = useState([2, 3, 4]);
    const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, dataArray.length);

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    return (
        <DataTable style={styles.container}>
            <DataTable.Header style={styles.header}>
                {keys.map((key, index) => (
                    <DataTable.Title key={index} style={styles.title}>{key}</DataTable.Title>
                ))}
            </DataTable.Header>

            {dataArray.slice(from, to).map((row: { [key: string]: any }, index: number) => (
                <DataTable.Row key={index} style={styles.row}>
                    {keys.map((key, i) => (
                        <DataTable.Cell key={i} style={styles.cell}>{String(row[key])}</DataTable.Cell>
                    ))}
                </DataTable.Row>
            ))}

            <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(dataArray.length / itemsPerPage)}
                onPageChange={(page) => setPage(page)}
                label={`${from + 1}-${to} of ${dataArray.length}`}
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={itemsPerPage}
                onItemsPerPageChange={onItemsPerPageChange}
                showFastPaginationControls
                selectPageDropdownLabel={'Rows per page'}
                style={styles.pagination}
            />
        </DataTable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        margin: 10,
    },
    header: {
        backgroundColor: 'grey',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    title: {
        color: '#fff',
    },
    row: {
        backgroundColor: 'beige',
    },
    cell: {
        color: '#000',
    },
    pagination: {
        backgroundColor: 'pink',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
});

export default DataTableComponent;
