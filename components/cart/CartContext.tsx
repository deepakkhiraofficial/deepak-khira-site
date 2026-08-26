"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

/* ============================================================
   TYPES
============================================================ */

export type Product = {
  _id?: string;
  id?: string;

  name: string;
  price: number;

  stock?: number | null;
  inStock?: boolean;

  images?: string[];
  slug?: string;

  category?: string;
  description?: string;

  featured?: boolean;
  status?: "active" | "draft";

  rating?: number;
  popularityScore?: number;
};

export type CartProduct = Product & {
  _id: string;
};

export type CartItem = {
  product: CartProduct;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  items: CartItem[];

  cartCount: number;
  totalItems: number;
  subtotal: number;

  addToCart: (product: Product, quantity?: number) => boolean;

  removeFromCart: (productId: string) => void;

  updateQuantity: (productId: string, quantity: number) => void;

  clearCart: () => void;

  isInCart: (productId: string) => boolean;

  getItemQuantity: (productId: string) => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "deepak-khira-cart";

/* ============================================================
   HELPERS
============================================================ */

function getProductId(product: Product): string {
  if (typeof product._id === "string" && product._id.trim()) {
    return product._id.trim();
  }

  if (typeof product.id === "string" && product.id.trim()) {
    return product.id.trim();
  }

  const mongoId = product._id as unknown;

  if (
    mongoId &&
    typeof mongoId === "object" &&
    "$oid" in mongoId &&
    typeof (
      mongoId as {
        $oid?: unknown;
      }
    ).$oid === "string"
  ) {
    return (
      mongoId as {
        $oid: string;
      }
    ).$oid;
  }

  return "";
}

function normalizeProduct(product: Product): CartProduct | null {
  const id = getProductId(product);

  if (!id) {
    return null;
  }

  const price = Number(product.price);

  if (!Number.isFinite(price) || price <= 0) {
    return null;
  }

  return {
    ...product,
    _id: id,
  };
}

function isValidCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<CartItem>;

  if (!item.product) {
    return false;
  }

  if (typeof item.product !== "object" || !("_id" in item.product)) {
    return false;
  }

  if (typeof item.product._id !== "string" || !item.product._id) {
    return false;
  }

  if (
    typeof item.quantity !== "number" ||
    !Number.isFinite(item.quantity) ||
    item.quantity < 1
  ) {
    return false;
  }

  return true;
}

function sanitizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const validItems: CartItem[] = [];

  for (const rawItem of value) {
    if (!isValidCartItem(rawItem)) {
      continue;
    }

    const product = rawItem.product;

    const price = Number(product.price);

    if (!Number.isFinite(price) || price <= 0) {
      continue;
    }

    const quantity = Math.max(1, Math.floor(Number(rawItem.quantity)));

    validItems.push({
      product: {
        ...product,
        _id: product._id,
      },
      quantity,
    });
  }

  return validItems;
}

/* ============================================================
   PROVIDER
============================================================ */

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [hydrated, setHydrated] = useState(false);

  /* ==========================================================
     LOAD CART
  ========================================================== */

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);

      if (!savedCart) {
        setHydrated(true);
        return;
      }

      const parsed: unknown = JSON.parse(savedCart);

      const cleanCart = sanitizeCart(parsed);

      setCartItems(cleanCart);

      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cleanCart));
    } catch (error) {
      console.error("CART LOAD ERROR:", error);

      window.localStorage.removeItem(CART_STORAGE_KEY);

      setCartItems([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  /* ==========================================================
     SAVE CART
  ========================================================== */

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("CART SAVE ERROR:", error);
    }
  }, [cartItems, hydrated]);

  /* ==========================================================
     MULTI TAB SYNC
  ========================================================== */

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== CART_STORAGE_KEY) {
        return;
      }

      if (!event.newValue) {
        setCartItems([]);
        return;
      }

      try {
        const parsed: unknown = JSON.parse(event.newValue);

        setCartItems(sanitizeCart(parsed));
      } catch (error) {
        console.error("CART SYNC ERROR:", error);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [hydrated]);

  /* ==========================================================
     ADD TO CART
  ========================================================== */

  const addToCart = useCallback((product: Product, quantity = 1): boolean => {
    if (!product) {
      toast.error("Product information is missing.");

      return false;
    }

    const normalizedProduct = normalizeProduct(product);

    if (!normalizedProduct) {
      console.error("INVALID PRODUCT PASSED TO CART:", product);

      toast.error("Unable to add this product to cart.");

      return false;
    }

    const price = Number(normalizedProduct.price);

    if (!Number.isFinite(price) || price <= 0) {
      toast.error("This product is currently unavailable.");

      return false;
    }

    const requestedQuantity = Math.floor(Number(quantity));

    if (!Number.isFinite(requestedQuantity) || requestedQuantity < 1) {
      toast.error("Please select a valid quantity.");

      return false;
    }

    const hasStockInformation =
      typeof normalizedProduct.stock === "number" &&
      Number.isFinite(normalizedProduct.stock);

    const stock = hasStockInformation
      ? Math.max(0, Math.floor(normalizedProduct.stock as number))
      : null;

    if (normalizedProduct.inStock === false) {
      toast.error("This product is currently out of stock.");

      return false;
    }

    if (stock !== null && stock <= 0) {
      toast.error("This product is currently out of stock.");

      return false;
    }

    /*
     * IMPORTANT:
     * Do not call toast inside setCartItems().
     */

    let result:
      | {
          success: boolean;
          message?: string;
          type?: "success" | "error";
        }
      | undefined;

    setCartItems((currentCart) => {
      const existingIndex = currentCart.findIndex(
        (item) => item.product._id === normalizedProduct._id
      );

      /* =========================================
               NEW PRODUCT
            ========================================== */

      if (existingIndex === -1) {
        let finalQuantity = requestedQuantity;

        if (stock !== null && finalQuantity > stock) {
          finalQuantity = stock;

          result = {
            success: false,
            type: "error",
            message: `Only ${stock} ${
              stock === 1 ? "item" : "items"
            } available.`,
          };
        } else {
          result = {
            success: true,
            type: "success",
            message: "Product added to cart 🛒",
          };
        }

        if (finalQuantity <= 0) {
          return currentCart;
        }

        return [
          ...currentCart,
          {
            product: normalizedProduct,
            quantity: finalQuantity,
          },
        ];
      }

      /* =========================================
               EXISTING PRODUCT
            ========================================== */

      const existing = currentCart[existingIndex];

      const newQuantity = existing.quantity + requestedQuantity;

      if (stock !== null && newQuantity > stock) {
        const remaining = Math.max(0, stock - existing.quantity);

        if (remaining <= 0) {
          result = {
            success: false,
            type: "error",
            message: `Maximum ${stock} ${
              stock === 1 ? "item" : "items"
            } already in cart.`,
          };

          return currentCart;
        }

        result = {
          success: false,
          type: "error",
          message: `Only ${remaining} more ${
            remaining === 1 ? "item" : "items"
          } available.`,
        };

        return currentCart;
      }

      const updatedCart = [...currentCart];

      updatedCart[existingIndex] = {
        ...existing,

        product: normalizedProduct,

        quantity: newQuantity,
      };

      result = {
        success: true,
        type: "success",
        message: `Added ${requestedQuantity} more to cart 🛒`,
      };

      return updatedCart;
    });

    /*
     * Side effect is now OUTSIDE
     * the state updater.
     */

    if (result?.message) {
      if (result.type === "error") {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
    }

    return result?.success ?? false;
  }, []);

  /* ==========================================================
     REMOVE FROM CART
  ========================================================== */

  const removeFromCart = useCallback(
    (productId: string) => {
      if (!productId) {
        return;
      }

      const exists = cartItems.some((item) => item.product._id === productId);

      if (!exists) {
        return;
      }

      setCartItems((currentCart) =>
        currentCart.filter((item) => item.product._id !== productId)
      );

      toast.success("Product removed from cart.");
    },
    [cartItems]
  );

  /* ==========================================================
     UPDATE QUANTITY
  ========================================================== */

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (!productId) {
        return;
      }

      const requestedQuantity = Math.floor(Number(quantity));

      if (!Number.isFinite(requestedQuantity)) {
        toast.error("Invalid quantity.");

        return;
      }

      const item = cartItems.find(
        (cartItem) => cartItem.product._id === productId
      );

      if (!item) {
        return;
      }

      /* =============================================
           REMOVE ITEM
        ============================================== */

      if (requestedQuantity <= 0) {
        setCartItems((currentCart) =>
          currentCart.filter((cartItem) => cartItem.product._id !== productId)
        );

        toast.success("Product removed from cart.");

        return;
      }

      /* =============================================
           STOCK CHECK
        ============================================== */

      const hasStock =
        typeof item.product.stock === "number" &&
        Number.isFinite(item.product.stock);

      let finalQuantity = requestedQuantity;

      if (hasStock) {
        const stock = Math.max(0, Math.floor(item.product.stock as number));

        if (stock <= 0) {
          setCartItems((currentCart) =>
            currentCart.filter((cartItem) => cartItem.product._id !== productId)
          );

          toast.error("This product is out of stock.");

          return;
        }

        if (requestedQuantity > stock) {
          finalQuantity = stock;

          toast.error(`Only ${stock} available.`);
        }
      }

      setCartItems((currentCart) =>
        currentCart.map((cartItem) => {
          if (cartItem.product._id !== productId) {
            return cartItem;
          }

          return {
            ...cartItem,
            quantity: finalQuantity,
          };
        })
      );
    },
    [cartItems]
  );

  /* ==========================================================
     CLEAR CART
  ========================================================== */

  const clearCart = useCallback(() => {
    if (cartItems.length === 0) {
      return;
    }

    setCartItems([]);

    toast.success("Cart cleared successfully.");
  }, [cartItems.length]);

  /* ==========================================================
     IS IN CART
  ========================================================== */

  const isInCart = useCallback(
    (productId: string): boolean => {
      if (!productId) {
        return false;
      }

      return cartItems.some((item) => item.product._id === productId);
    },
    [cartItems]
  );

  /* ==========================================================
     GET ITEM QUANTITY
  ========================================================== */

  const getItemQuantity = useCallback(
    (productId: string): number => {
      if (!productId) {
        return 0;
      }

      return (
        cartItems.find((item) => item.product._id === productId)?.quantity ?? 0
      );
    },
    [cartItems]
  );

  /* ==========================================================
     TOTAL ITEMS
  ========================================================== */

  const totalItems = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  /* ==========================================================
     SUBTOTAL
  ========================================================== */

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + Number(item.product.price) * item.quantity,
        0
      ),
    [cartItems]
  );

  /* ==========================================================
     CONTEXT VALUE
  ========================================================== */

  const value = useMemo<CartContextType>(
    () => ({
      cartItems,

      items: cartItems,

      cartCount: totalItems,

      totalItems,

      subtotal,

      addToCart,

      removeFromCart,

      updateQuantity,

      clearCart,

      isInCart,

      getItemQuantity,
    }),
    [
      cartItems,
      totalItems,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
      getItemQuantity,
    ]
  );

  /* ==========================================================
     PROVIDER
  ========================================================== */

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/* ============================================================
   USE CART HOOK
============================================================ */

export function useCart(): CartContextType {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider. " +
        "Make sure your component is wrapped with <CartProvider>."
    );
  }

  return context;
}
