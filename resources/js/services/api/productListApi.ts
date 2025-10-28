import { ListApi, ProductModel } from "@app/js/app.types";
import { baseAxios } from "../axiosApi";
import catchError from "../catchError";

export default async function productListApi(limit = 15, orderBy = "id,desc", page = 1, search = "") {

    const query = new URLSearchParams({
        "orderBy": orderBy,
        "limit": limit.toString(),
        "page": page.toString()
    });

    if (search.trim()) {
        query.append("search", search.trim());
    }

    try {
        const { data } = await baseAxios.get<ListApi<ProductModel>>(`api/products?${query}`);

        return data;
    } catch (error) {
        return catchError(error);
    }
}