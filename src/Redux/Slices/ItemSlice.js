import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
const itemMasterSlice = createSlice({
  name: 'itemMaster',
  initialState: {
    items: [],
    itemCategories: [],
    isFetching: false,
    itemUOMs: [],
    nafdacs: [],
    nafdacNames: [],
    crias: [],
    category: [],
    subCategory: [],
    superCategory: [],
    error: false
  },
  reducers: {
    itemsFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    itemsFetchSuccess: (state, action) => {
      toast.success(`Items Fetched Successfully`);
      state.isFetching = false;
      state.error = false;
      state.items = action.payload.data;
    },
    itemsFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Items`);
    },
    categoryFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    categoryFetchSuccess: (state, action) => {
      toast.success(`category Fetched Successfully`);
      state.isFetching = false;
      state.error = false;
      state.category = action.payload.data;
    },
    categoryFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Items`);
    },
    subCategoryFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    subCategoryFetchSuccess: (state, action) => {
      toast.success(`subCategory Fetched Successfully`);
      state.isFetching = false;
      state.error = false;
      state.subCategory = action.payload.data;
    },
    subCategoryFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Items`);
    },

    superCategoryFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    superCategoryFetchSuccess: (state, action) => {
      toast.success(`Super Category Fetched Successfully`);
      state.isFetching = false;
      state.error = false;
      state.superCategory = action.payload.data;
    },
    superCategoryFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Items`);
    },

    itemCategoriesFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    itemCategoriesFetchSuccess: (state, action) => {
      // toast.success(`Item Categories Fetched Successfully`);
      state.isFetching = false;
      state.error = false;
      state.itemCategories = action.payload.data;
    },
    itemCategoriesFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Items`);
    },
    itemUOMFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    itemUOMFetchSuccess: (state, action) => {
      // toast.success(`Item UOM's Fetched Successfully`);
      state.isFetching = false;
      state.error = false;
      state.itemUOMs = action.payload.data;
    },
    itemUOMFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Items`);
    },
    nafdacsFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    nafdacsFetchSuccess: (state, action) => {
      toast.success(`nafdacs Fetched Successfully`);
      state.isFetching = false;
      state.error = false;
      state.nafdacs = action.payload.data;
    },
    nafdacsFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Users`);
    },
    nafdacsNameFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    nafdacsNameFetchSuccess: (state, action) => {
      // toast.success(`Nafdac Name Fetched Successfully`);
      state.isFetching = false;
      state.error = false;
      state.nafdacNames = action.payload.data;
    },
    nafdacsNameFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Users`);
    },
    criasFetchStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    criasFetchSuccess: (state, action) => {
      // toast.success(`crias Fetched Successfully`);
      state.isFetching = false;
      state.error = false;
      state.crias = action.payload.data;
    },
    criasFetchFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Users`);
    },
    itemCreateStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    itemCreateSuccess: (state) => {
      toast.success(`Item sent Successfully`);
      state.isFetching = false;
      state.error = false;
    },
    itemCreateFailure: (state) => {
      state.isFetching = true;
      state.error = false;
      toast.error(`An Error has occurred at Items`);
    }
  }
});

export const {
  itemsFetchStart,
  itemsFetchSuccess,
  itemsFetchFailure,

  categoryFetchStart,
  categoryFetchSuccess,
  categoryFetchFailure,

  subCategoryFetchStart,
  subCategoryFetchSuccess,
  subCategoryFetchFailure,

  superCategoryFetchStart,
  superCategoryFetchSuccess,
  superCategoryFetchFailure,

  itemCategoriesFetchFailure,
  itemCategoriesFetchStart,
  itemCategoriesFetchSuccess,

  itemUOMFetchFailure,
  itemUOMFetchStart,
  itemUOMFetchSuccess,

  nafdacsFetchStart,
  nafdacsFetchSuccess,
  nafdacsFetchFailure,

  nafdacsNameFetchStart,
  nafdacsNameFetchSuccess,
  nafdacsNameFetchFailure,

  criasFetchStart,
  criasFetchSuccess,
  criasFetchFailure,

  itemCreateStart,
  itemCreateSuccess,
  itemCreateFailure
} = itemMasterSlice.actions;

export default itemMasterSlice.reducer;
