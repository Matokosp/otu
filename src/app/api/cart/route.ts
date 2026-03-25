import { NextRequest, NextResponse } from "next/server";
import { createCart, addToCart, getCart, updateCartLine, removeCartLine } from "../../lib/cart";

export async function POST(req: NextRequest) {
  const { action, variantId, quantity, cartId, lineId } = await req.json();

  try {
    if (action === "create") {
      const result = await createCart(variantId, quantity);
      return NextResponse.json(result);
    }

    if (action === "add") {
      const result = await addToCart(cartId, variantId, quantity);
      return NextResponse.json(result);
    }

    if (action === "get") {
      const result = await getCart(cartId);
      return NextResponse.json(result);
    }

    if (action === "update") {
      const result = await updateCartLine(cartId, lineId, quantity);
      return NextResponse.json(result);
    }

    if (action === "remove") {
      const result = await removeCartLine(cartId, lineId);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Cart API error:", error);
    return NextResponse.json({ error: "Cart operation failed" }, { status: 500 });
  }
}
