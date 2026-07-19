import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createCart,
  addToCart,
  getCart,
  updateCartLine,
  removeCartLine,
  updateCartBuyerIdentity,
} from "../../lib/cart";
import { getRegionCountry, isValidRegion, COOKIE_NAME } from "../../lib/market";

async function resolveCountry() {
  const jar = await cookies();
  const region = jar.get(COOKIE_NAME)?.value;
  return getRegionCountry(isValidRegion(region) ? region : "sweden");
}

export async function POST(req: NextRequest) {
  const { action, variantId, quantity, cartId, lineId } = await req.json();
  const country = await resolveCountry();

  try {
    if (action === "create") {
      if (typeof variantId !== "string" || !variantId) {
        return NextResponse.json({ error: "variantId is required" }, { status: 400 });
      }
      const result = await createCart(variantId, quantity, country);
      return NextResponse.json(result);
    }

    if (action === "add") {
      if (typeof cartId !== "string" || !cartId || typeof variantId !== "string" || !variantId) {
        return NextResponse.json({ error: "cartId and variantId are required" }, { status: 400 });
      }
      const result = await addToCart(cartId, variantId, quantity, country);
      return NextResponse.json(result);
    }

    if (action === "get") {
      if (typeof cartId !== "string" || !cartId) {
        return NextResponse.json({ error: "cartId is required" }, { status: 400 });
      }
      await updateCartBuyerIdentity(cartId, country);
      const result = await getCart(cartId, country);
      return NextResponse.json(result);
    }

    if (action === "update") {
      if (typeof cartId !== "string" || !cartId || typeof lineId !== "string" || !lineId) {
        return NextResponse.json({ error: "cartId and lineId are required" }, { status: 400 });
      }
      const result = await updateCartLine(cartId, lineId, quantity, country);
      return NextResponse.json(result);
    }

    if (action === "remove") {
      if (typeof cartId !== "string" || !cartId || typeof lineId !== "string" || !lineId) {
        return NextResponse.json({ error: "cartId and lineId are required" }, { status: 400 });
      }
      const result = await removeCartLine(cartId, lineId, country);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Cart API error:", error);
    return NextResponse.json({ error: "Cart operation failed" }, { status: 500 });
  }
}
