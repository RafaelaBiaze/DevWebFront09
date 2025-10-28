import ProductList from "@app/js/React/components/ProductList/ProductList";
import ProductCreateForm from "@app/js/React/components/ProductCreateForm/ProductCreateForm";
import Pagination from "@app/js/React/components/Pagination/Pagination";
import { useEffect, useState, useRef } from "react";
import { ProductModel, ListApi } from "@app/js/app.types";
import productListApi from "@app/js/services/api/productListApi";

export default function Products() {

    const [productList, setProductList] = useState<ProductModel[] | "error">();
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrev, setHasPrev] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    
    // Ref para controlar o debounce
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        listApi(1, "");
    }, []);

    // Effect para implementar debounce na busca
    useEffect(() => {
        // Limpar timeout anterior se existir
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Criar novo timeout para executar a busca após 500ms
        debounceRef.current = setTimeout(() => {
            listApi(1, searchTerm); // Sempre resetar para página 1 na busca
            setCurrentPage(1);
        }, 500);

        // Cleanup function para limpar o timeout quando o componente for desmontado
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [searchTerm]);

    const listApi = async (page = 1, search = "") => {
        setLoading(true);
        console.log(`Buscando página ${page} com termo: "${search}"`); // Debug
        
        const resp = await productListApi(10, "id,desc", page, search);
        
        if ("error" in resp) {
            setProductList("error");
            setLoading(false);
            return;
        }

        console.log('Resposta da API:', resp); // Debug

        setProductList(resp.rows);
        setCurrentPage(page);
        setTotalCount(resp.count);
        setHasNext(resp.next !== null);
        setHasPrev(page > 1);
        
        // Calcular total de páginas baseado no count e limit
        const calculatedTotalPages = Math.ceil(resp.count / resp.limit);
        setTotalPages(calculatedTotalPages);
        
        setLoading(false);
    };

    const createProductHandler = () => {
        // Após criar, recarregar a primeira página com o termo de busca atual
        listApi(1, searchTerm);
        setCurrentPage(1);
    };

    const deleteProductHandler = () => {
        // Após deletar, recarregar a página atual com o termo de busca atual
        listApi(currentPage, searchTerm);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        // O debounce vai cuidar da busca
    };

    const handlePageChange = (page: number) => {
        console.log(`Mudando para página ${page}`); // Debug
        listApi(page, searchTerm);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setCurrentPage(1);
        listApi(1, "");
    };

    return (
        <div className="row g-4">
            <ProductCreateForm onCreate={createProductHandler} />
            
            <div className="col-12 col-lg-8">
                {/* Campo de busca */}
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col">
                                <label htmlFor="searchProducts" className="form-label mb-2">
                                    <i className="fa-solid fa-magnifying-glass me-2" aria-hidden="true"></i>
                                    Buscar produtos
                                </label>
                                <div className="input-group">
                                    <input
                                        id="searchProducts"
                                        type="text"
                                        className="form-control"
                                        placeholder="Digite o nome do produto..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                    {searchTerm && (
                                        <button 
                                            className="btn btn-outline-secondary" 
                                            type="button"
                                            onClick={clearSearch}
                                            aria-label="Limpar busca"
                                        >
                                            <i className="fa-solid fa-times" aria-hidden="true"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Informações da busca */}
                        {(searchTerm || totalCount > 0) && (
                            <div className="mt-3">
                                <small className="text-muted">
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Buscando...
                                        </>
                                    ) : (
                                        <>
                                            {searchTerm ? (
                                                <>Encontrados <strong>{totalCount}</strong> produto(s) para "<strong>{searchTerm}</strong>"</>
                                            ) : (
                                                <>Total de <strong>{totalCount}</strong> produto(s) - Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong></>
                                            )}
                                        </>
                                    )}
                                </small>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lista de produtos */}
                <ProductList products={productList} onDelete={deleteProductHandler} />
                
                {/* Paginação */}
                {totalPages > 1 && (
                    <div className="mt-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            hasNext={hasNext}
                            hasPrev={hasPrev}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}