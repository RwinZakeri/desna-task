"use client";
import Card from "@/components/UI/card";
import {
  CategoryType,
  FilterType,
  ProductType,
  SelectedFilterType,
} from "@/types/type.global";
import { ChangeEvent, useEffect, useState } from "react";
import db from "../db/DESNA_FrontEnd_Task.json";
import useSearchParam from "../hooks/useSearchParam";

const App = () => {
  const {
    Data: { Products, Filters, Categories },
  } = db;

  const [selectedFilter, setSelectedFilter] = useState<SelectedFilterType[]>(
    []
  );
  const [selectCategory, setSelectCategory] = useState<Array<CategoryType>>([]);
  const [products, setProducts] = useState<ProductType[]>(Products);

  const { find, set, remove } = useSearchParam("/");

  useEffect(() => {
    const filtersParam = find("filters");
    if (filtersParam) {
      const filtersArray =
        typeof filtersParam === "string" ? [filtersParam] : filtersParam;
      const parsed = filtersArray.map((pair) => {
        const [filterId, optionId] = pair.split("-").map(Number);
        return { filterId, optionId };
      });
      setSelectedFilter(parsed);
    }

    const categoriesParam = find("categories");
    if (categoriesParam) {
      const categoriesArray =
        typeof categoriesParam === "string"
          ? [categoriesParam]
          : categoriesParam;
      const categoryIds = categoriesArray.map(Number);
      const selectedCategories = Categories.filter((cat) =>
        categoryIds.includes(cat.CategoryID)
      );
      setSelectCategory(selectedCategories);
    }
  }, []);

  const filterClickHandler = (
    e: ChangeEvent<HTMLInputElement>,
    filterId: number,
    optionId: number
  ) => {
    const checked = e.target.checked;

    setSelectedFilter((prev) => {
      let newFilters;
      if (checked) {
        const allSameGroup = prev.every((item) => item.filterId === filterId);
        if (prev.length > 0 && !allSameGroup) {
          newFilters = [{ filterId, optionId }];
        } else {
          const exists = prev.some(
            (item) => item.filterId === filterId && item.optionId === optionId
          );
          newFilters = exists ? prev : [...prev, { filterId, optionId }];
        }
      } else {
        newFilters = prev.filter(
          (item) => !(item.filterId === filterId && item.optionId === optionId)
        );
      }

      if (newFilters.length > 0) {
        set(
          "filters",
          newFilters.map((f) => `${f.filterId}-${f.optionId}`)
        );
      } else {
        remove("filters", "");
      }

      return newFilters;
    });
  };

  const categoryHandler = (
    e: ChangeEvent<HTMLInputElement>,
    categoryId: number
  ) => {
    // @ts-expect-error temp
    setSelectCategory((prev) => {
      let updatedCategories;

      if (e.target.checked) {
        const exists = prev.some((item) => item.CategoryID === categoryId);

        if (!exists) {
          updatedCategories = [...prev, { CategoryID: categoryId }];
        } else {
          updatedCategories = prev;
        }
      } else {
        updatedCategories = prev.filter(
          (item) => item.CategoryID !== categoryId
        );
      }

      const categoryIds = updatedCategories.map((item) => item.CategoryID);
      if (categoryIds.length > 0) {
        set("categories", categoryIds.map(String));
      } else {
        remove("categories", "");
      }

      return updatedCategories;
    });
  };

  useEffect(() => {
    let filtered = [...Products];

    if (selectedFilter.length > 0) {
      filtered = filtered.filter((product) =>
        product.Filters.some((prodFilter) =>
          selectedFilter.some(
            (sel) =>
              prodFilter.Filter === sel.filterId &&
              prodFilter.Option === sel.optionId
          )
        )
      );
    }
    if (selectCategory.length > 0) {
      const selectedCategoryIds = selectCategory.map((cat) => cat.CategoryID);
      filtered = filtered.filter((product) =>
        selectedCategoryIds.includes(product.CategoryID)
      );
    }

    setProducts(filtered);
  }, [selectedFilter, selectCategory, Products]);

  return (
    <div className="w-full h-screen flex gap-4">
      <div className="w-fit flex flex-col gap-4">
        {/* categories */}
        <div className="w-60 h-fit">
          <ul className="w-full h-fit p-2 border-2 rounded-lg flex flex-col gap-4">
            {Categories.map((category: CategoryType) => (
              <li key={category.CategoryID} className="flex gap-4">
                <input
                  type="checkbox"
                  className="checkbox"
                  onChange={(e) => categoryHandler(e, category.CategoryID)}
                  checked={selectCategory.some(
                    (cat) => cat.CategoryID === category.CategoryID
                  )}
                  id={`cat-${category.CategoryID}`}
                />
                <label htmlFor={`cat-${category.CategoryID}`}>
                  {category.CategoryName}
                </label>
              </li>
            ))}
          </ul>
        </div>
        {/* Filters */}
        <div className="w-60 h-full">
          <ul className="w-full h-full p-2 border-2 rounded-lg flex flex-col gap-4">
            {Filters.map((filter: FilterType) => (
              <li key={filter.FilterID} className="flex gap-10 flex-col">
                <h2>{filter.FilterName}</h2>
                {filter.Options.map((option) => {
                  const isChecked = selectedFilter.some(
                    (sel) =>
                      sel.filterId === filter.FilterID &&
                      sel.optionId === option.OptionID
                  );
                  return (
                    <div key={option.OptionID} className="flex gap-2">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          filterClickHandler(
                            e,
                            filter.FilterID,
                            option.OptionID
                          )
                        }
                        id={`opt-${filter.FilterID}-${option.OptionID}`}
                      />
                      <label
                        htmlFor={`opt-${filter.FilterID}-${option.OptionID}`}
                      >
                        {option.OptionName}
                      </label>
                    </div>
                  );
                })}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* products */}
      <div className="flex gap-4 flex-wrap">
        {products.map((product: ProductType) => (
          <Card key={`product-${product.ProductName}`} data={product} />
        ))}
      </div>
    </div>
  );
};

export default App;
