import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router';
import { ChevronDown, X, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { PRODUCTS, Product, Segment, SubCategory } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonCard';

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'discount';

const SIZE_FILTERS: Record<string, string[]> = {
  Clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '34', '36', '38', '40', '42'],
  Shoes: ['EU 36', 'EU 37', 'EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'],
  Accessories: ['One Size'],
  Girls: ['2Y', '3Y', '4Y', '5Y', '6Y', '8Y', '10Y', '12Y'],
  Boys: ['2Y', '3Y', '4Y', '5Y', '6Y', '8Y', '10Y'],
  Babies: ['0-3M', '3-6M', '6-9M', '9-12M', '12-18M'],
};

const DISCOUNT_FILTERS = [
  { label: '20% or more', value: 20 },
  { label: '40% or more', value: 40 },
  { label: '60% or more', value: 60 },
];

type ActiveFilters = {
  sizes: Set<string>;
  brands: Set<string>;
  minDiscount: number | null;
  maxPrice: number | null;
};

function FilterSection({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div style={{ borderBottom: '1px solid #e4e4e4' }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 hover:text-[#0a0a0a] transition-colors"
        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#0a0a0a', background: 'none', border: 'none', cursor: 'pointer' }}
        aria-expanded={open}
      >
        {title}
        <ChevronDown
          className="w-4 h-4 text-[#a0a0a0] transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>
      {open && <div className="pb-4 space-y-2">{children}</div>}
    </div>
  );
}

// Map URL params to segment and subcategory
function resolveFromPath(pathname: string): { segment: Segment; subcategory: SubCategory; displayName: string } {
  const parts = pathname.split('/').filter(Boolean);
  const segMap: Record<string, Segment> = { women: 'Women', men: 'Men', kids: 'Kids' };
  const segment = segMap[parts[0]?.toLowerCase() || ''] || 'Women';

  const subMap: Record<string, SubCategory> = {
    clothing: 'Clothing', shoes: 'Shoes', accessories: 'Accessories',
    girls: 'Girls', boys: 'Boys', babies: 'Babies',
  };
  const subcategory = subMap[parts[1]?.toLowerCase() || ''] || (segment === 'Kids' ? 'Girls' : 'Clothing');

  return { segment, subcategory, displayName: subcategory };
}

export function ShopPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const { segment, subcategory, displayName } = resolveFromPath(location.pathname);

  const segSlug = segment.toLowerCase();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState<SortOption>('relevance');
  const [filters, setFilters] = useState<ActiveFilters>({ sizes: new Set(), brands: new Set(), minDiscount: null, maxPrice: null });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState({ size: true, brand: true, discount: true, price: true });

  // Get available brands for the current segment/subcategory
  const availableBrands = [...new Set(PRODUCTS.filter(p => p.segment === segment && p.subcategory === subcategory).map(p => p.brand))].sort();

  const applyFiltersAndSort = useCallback(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let result: Product[];

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        result = PRODUCTS.filter(p =>
          p.segment === segment && (
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.info.toLowerCase().includes(q)
          )
        );
      } else {
        result = PRODUCTS.filter(p => p.segment === segment && p.subcategory === subcategory);
      }

      if (filters.sizes.size > 0) result = result.filter(p => p.sizes.some(s => [...filters.sizes].some(fs => s.includes(fs) || fs.includes(s))));
      if (filters.brands.size > 0) result = result.filter(p => filters.brands.has(p.brand));
      if (filters.minDiscount) result = result.filter(p => p.pct >= filters.minDiscount!);
      if (filters.maxPrice) result = result.filter(p => p.price <= filters.maxPrice!);

      switch (sort) {
        case 'price-asc':  result = [...result].sort((a, b) => a.price - b.price); break;
        case 'price-desc': result = [...result].sort((a, b) => b.price - a.price); break;
        case 'discount':   result = [...result].sort((a, b) => b.pct - a.pct); break;
        case 'newest':     result = [...result].reverse(); break;
      }

      setProducts(result);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [segment, subcategory, filters, sort, searchQuery]);

  useEffect(() => {
    if (!searchQuery) {
      setFilters({ sizes: new Set(), brands: new Set(), minDiscount: null, maxPrice: null });
      setSort('relevance');
    }
  }, [segment, subcategory]);

  useEffect(() => {
    const cleanup = applyFiltersAndSort();
    return cleanup;
  }, [applyFiltersAndSort]);

  function toggleSize(size: string) {
    setFilters(f => {
      const sizes = new Set(f.sizes);
      sizes.has(size) ? sizes.delete(size) : sizes.add(size);
      return { ...f, sizes };
    });
  }

  function toggleBrand(brand: string) {
    setFilters(f => {
      const brands = new Set(f.brands);
      brands.has(brand) ? brands.delete(brand) : brands.add(brand);
      return { ...f, brands };
    });
  }

  function setDiscount(val: number | null) {
    setFilters(f => ({ ...f, minDiscount: f.minDiscount === val ? null : val }));
  }

  function clearAllFilters() {
    setFilters({ sizes: new Set(), brands: new Set(), minDiscount: null, maxPrice: null });
  }

  const PRICE_CAPS = [100, 200, 300, 500];
  const totalActiveFilters = filters.sizes.size + filters.brands.size + (filters.minDiscount ? 1 : 0) + (filters.maxPrice ? 1 : 0);
  const sizeOptions = SIZE_FILTERS[subcategory] || SIZE_FILTERS.Clothing;

  const FilterContent = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b6b6b', fontWeight: 500 }}>
          Filter & Refine
        </p>
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-1.5 hover:text-[#b91c1c] transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#6b6b6b', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 2 }}
          aria-label="Remove all active filters"
          disabled={totalActiveFilters === 0}
        >
          <X className="w-3.5 h-3.5" />
          Clear all {totalActiveFilters > 0 && `(${totalActiveFilters})`}
        </button>
      </div>

      {totalActiveFilters > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4" role="list" aria-label="Active filters">
          {[...filters.sizes].map(s => (
            <button key={s} role="listitem" onClick={() => toggleSize(s)} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a0a0a] text-[#fafafa] hover:bg-[#3a3a3a] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11 }} aria-label={`Remove filter: ${s}`}>
              {s} <X className="w-3 h-3" />
            </button>
          ))}
          {[...filters.brands].map(b => (
            <button key={b} role="listitem" onClick={() => toggleBrand(b)} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a0a0a] text-[#fafafa] hover:bg-[#3a3a3a] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11 }} aria-label={`Remove filter: ${b}`}>
              {b} <X className="w-3 h-3" />
            </button>
          ))}
          {filters.minDiscount && (
            <button role="listitem" onClick={() => setDiscount(null)} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a0a0a] text-[#fafafa] hover:bg-[#3a3a3a] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11 }} aria-label={`Remove filter: ${filters.minDiscount}% off`}>
              -{filters.minDiscount}%+ <X className="w-3 h-3" />
            </button>
          )}
          {filters.maxPrice && (
            <button role="listitem" onClick={() => setFilters(f => ({ ...f, maxPrice: null }))} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a0a0a] text-[#fafafa] hover:bg-[#3a3a3a] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11 }} aria-label={`Remove price cap: under €${filters.maxPrice}`}>
              Under €{filters.maxPrice} <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {!searchQuery && (
        <FilterSection title="Price" open={openSections.price} onToggle={() => setOpenSections(s => ({ ...s, price: !s.price }))}>
          <div className="flex flex-wrap gap-2">
            {PRICE_CAPS.map(cap => (
              <button
                key={cap}
                onClick={() => setFilters(f => ({ ...f, maxPrice: f.maxPrice === cap ? null : cap }))}
                aria-pressed={filters.maxPrice === cap}
                className="px-3 py-1.5 rounded-sm transition-all"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, border: '1px solid', borderColor: filters.maxPrice === cap ? '#0a0a0a' : '#e4e4e4', background: filters.maxPrice === cap ? '#0a0a0a' : 'transparent', color: filters.maxPrice === cap ? '#fafafa' : '#3a3a3a', cursor: 'pointer' }}
              >
                Under €{cap}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {!searchQuery && (
        <FilterSection title="Size" open={openSections.size} onToggle={() => setOpenSections(s => ({ ...s, size: !s.size }))}>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map(size => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                aria-pressed={filters.sizes.has(size)}
                className="px-3 py-1.5 rounded-sm transition-all"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, border: '1px solid', borderColor: filters.sizes.has(size) ? '#0a0a0a' : '#e4e4e4', background: filters.sizes.has(size) ? '#0a0a0a' : 'transparent', color: filters.sizes.has(size) ? '#fafafa' : '#3a3a3a', cursor: 'pointer' }}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Brand" open={openSections.brand} onToggle={() => setOpenSections(s => ({ ...s, brand: !s.brand }))}>
        <div className="space-y-2.5 max-h-52 overflow-y-auto custom-scroll pr-1">
          {availableBrands.map(brand => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer hover:text-[#0a0a0a] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#3a3a3a' }}>
              <input type="checkbox" checked={filters.brands.has(brand)} onChange={() => toggleBrand(brand)} className="w-3.5 h-3.5 accent-[#0a0a0a] cursor-pointer" aria-label={`Filter by brand: ${brand}`} />
              {brand}
            </label>
          ))}
        </div>
      </FilterSection>

      {!searchQuery && (
        <FilterSection title="Discount" open={openSections.discount} onToggle={() => setOpenSections(s => ({ ...s, discount: !s.discount }))}>
          <div className="space-y-2.5">
            {DISCOUNT_FILTERS.map(opt => (
              <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer hover:text-[#0a0a0a] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#3a3a3a' }}>
                <input type="checkbox" checked={filters.minDiscount === opt.value} onChange={() => setDiscount(opt.value)} className="w-3.5 h-3.5 accent-[#0a0a0a] cursor-pointer" aria-label={`Filter by discount: ${opt.label}`} />
                {opt.label}
              </label>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  );

  const pageTitle = searchQuery ? `Search results for "${searchQuery}"` : displayName;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 px-8 md:px-10 py-3.5" style={{ borderBottom: '1px solid #e4e4e4', fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#6b6b6b' }} aria-label="Breadcrumb">
        <Link to={`/${segSlug}`} className="hover:text-[#0a0a0a] transition-colors">{segment}</Link>
        <ChevronRight className="w-3 h-3" aria-hidden="true" />
        {searchQuery ? (
          <>
            <Link to={`/${segSlug}/${subcategory.toLowerCase()}`} className="hover:text-[#0a0a0a] transition-colors">{displayName}</Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <span style={{ color: '#0a0a0a' }}>Search</span>
          </>
        ) : (
          <span style={{ color: '#0a0a0a' }}>{displayName}</span>
        )}
      </nav>

      <div className="flex">
        {/* Sidebar – desktop */}
        <aside
          className="hidden md:block w-60 shrink-0 sticky"
          style={{ top: 109, height: 'calc(100vh - 109px)', overflowY: 'auto', borderRight: '1px solid #e4e4e4', padding: '24px 20px' }}
          aria-label="Product filters"
        >
          <FilterContent />
        </aside>

        {/* Main content */}
        <div className="flex-1 px-6 md:px-8 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: '#0a0a0a', lineHeight: 1.2 }}>
                {pageTitle}
              </h1>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#6b6b6b', marginTop: 2 }} aria-live="polite" role="status">
                {loading ? 'Loading...' : `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="flex md:hidden items-center gap-2 px-3 py-2 rounded-sm hover:bg-[#f2f2f2] transition-colors"
                style={{ border: '1px solid #e4e4e4', fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#3a3a3a', background: 'none', cursor: 'pointer' }}
                onClick={() => setSidebarOpen(true)}
                aria-label="Open filters"
                aria-expanded={sidebarOpen}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters {totalActiveFilters > 0 && `(${totalActiveFilters})`}
              </button>

              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#6b6b6b', whiteSpace: 'nowrap' }}>
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  value={sort}
                  onChange={e => setSort(e.target.value as SortOption)}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#0a0a0a', border: '1px solid #e4e4e4', borderRadius: 2, padding: '7px 12px', background: 'white', cursor: 'pointer', outline: 'none' }}
                  aria-label="Sort products by"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <SkeletonGrid count={6} />
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, color: '#0a0a0a', marginBottom: 8 }}>
                {searchQuery ? `No results for "${searchQuery}"` : 'No products found'}
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#6b6b6b', marginBottom: 20 }}>
                {searchQuery ? 'Try a different search term or browse a category.' : 'Try adjusting your filters or browse a different category.'}
              </p>
              <button
                onClick={searchQuery ? () => navigate(`/${segSlug}/${subcategory.toLowerCase()}`) : clearAllFilters}
                className="px-5 py-2.5 bg-[#0a0a0a] text-[#fafafa] rounded-sm hover:bg-[#2a2a2a] transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}
              >
                {searchQuery ? `Browse ${displayName}` : 'Remove All Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[800] overlay-enter md:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
          <aside className="fixed top-0 left-0 h-full w-80 bg-[#fafafa] z-[900] overflow-y-auto custom-scroll panel-enter md:hidden p-6" role="dialog" aria-modal="true" aria-label="Product filters">
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500 }}>Filters</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-[#f2f2f2] rounded-sm transition-colors" aria-label="Close filters">
                <X className="w-5 h-5 text-[#6b6b6b]" />
              </button>
            </div>
            <FilterContent />
            <button
              onClick={() => setSidebarOpen(false)}
              className="mt-6 w-full py-3.5 bg-[#0a0a0a] text-[#fafafa] rounded-sm hover:bg-[#2a2a2a] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}
            >
              Show {products.length} results
            </button>
          </aside>
        </>
      )}
    </div>
  );
}