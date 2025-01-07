const combineItems = (arr, idField, combineField) => {
    let idList = [];
    let combinedItems = [];

    arr.forEach((item) => {
        const index = idList.indexOf(item[idField]);
        if (index !== -1) {
            combinedItems[index][combineField] += item[combineField];
        } else {
            let newItem = {};
            newItem[idField] = item[idField];
            newItem[combineField] = item[combineField];
            combinedItems.push(newItem);
            idList.push(item[idField]);
        }
    });

    return combinedItems;
};

export default combineItems;