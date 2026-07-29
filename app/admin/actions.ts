'use server'

import { revalidatePath } from 'next/cache'
import { sql } from '@/lib/db'
import { supabase } from '@/lib/supabase'

export async function getProductsDb(onlyActive = false) {
  try {
    const rows = onlyActive
      ? await sql`SELECT * FROM products WHERE is_active = true ORDER BY created_at DESC`
      : await sql`SELECT * FROM products ORDER BY created_at DESC`

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      brand: row.brand,
      sku: row.sku,
      category: row.category_id,
      price: Number(row.price),
      image: row.image,
      stock: Number(row.stock),
      featured: Boolean(row.featured),
      is_active: row.is_active !== undefined ? Boolean(row.is_active) : true,
      description: row.description,
    }))
  } catch (error) {
    console.error('Error al obtener productos de la base de datos:', error)
    return []
  }
}

export async function getCategoriesDb() {
  try {
    const rows = await sql`SELECT * FROM categories ORDER BY created_at ASC`
    return rows.map((row) => ({
      id: row.id,
      label: row.label,
      short: row.short,
    }))
  } catch (error) {
    console.error('Error al obtener categorías de la base de datos:', error)
    return []
  }
}

export async function createProductDb(productData: {
  name: string
  brand: string
  sku: string
  category_id: string
  price: number
  image: string
  stock: number
  featured: boolean
  is_active: boolean
  description: string
}) {
  try {
    const id = productData.name
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
      .replace(/[^a-z0-9]+/g, '-') // Cambiar espacios y especiales por guiones
      .replace(/^-+|-+$/g, '') // Quitar guiones sobrantes al inicio/final
      + '-' + Math.random().toString(36).substring(2, 6)

    await sql`
      INSERT INTO products (id, name, brand, sku, category_id, price, image, stock, featured, is_active, description)
      VALUES (${id}, ${productData.name}, ${productData.brand}, ${productData.sku}, ${productData.category_id}, ${productData.price}, ${productData.image}, ${productData.stock}, ${productData.featured}, ${productData.is_active}, ${productData.description})
    `

    revalidatePath('/')
    revalidatePath('/catalog')
    revalidatePath('/admin')
  } catch (error: any) {
    console.error('Error al crear producto:', error)
    throw new Error(error.message || 'Error al crear el producto')
  }
}

export async function updateProductDb(
  id: string,
  productData: {
    name: string
    brand: string
    sku: string
    category_id: string
    price: number
    image: string
    stock: number
    featured: boolean
    is_active: boolean
    description: string
  }
) {
  try {
    await sql`
      UPDATE products SET
        name = ${productData.name},
        brand = ${productData.brand},
        sku = ${productData.sku},
        category_id = ${productData.category_id},
        price = ${productData.price},
        image = ${productData.image},
        stock = ${productData.stock},
        featured = ${productData.featured},
        is_active = ${productData.is_active},
        description = ${productData.description},
        updated_at = NOW()
      WHERE id = ${id}
    `

    revalidatePath('/')
    revalidatePath('/catalog')
    revalidatePath('/admin')
  } catch (error: any) {
    console.error('Error al actualizar producto:', error)
    throw new Error(error.message || 'Error al actualizar el producto')
  }
}

export async function deleteProductDb(id: string) {
  try {
    await sql`DELETE FROM products WHERE id = ${id}`

    revalidatePath('/')
    revalidatePath('/catalog')
    revalidatePath('/admin')
  } catch (error: any) {
    console.error('Error al eliminar producto:', error)
    throw new Error(error.message || 'Error al eliminar el producto')
  }
}

export async function updateProductStockDb(id: string, newStock: number) {
  try {
    const safeStock = Math.max(0, Math.floor(newStock))
    await sql`UPDATE products SET stock = ${safeStock}, updated_at = NOW() WHERE id = ${id}`

    revalidatePath('/')
    revalidatePath('/catalog')
    revalidatePath('/admin')
  } catch (error: any) {
    console.error('Error al actualizar stock:', error)
    throw new Error(error.message || 'Error al actualizar el stock')
  }
}

export async function toggleProductActiveDb(id: string, currentStatus: boolean) {
  try {
    await sql`UPDATE products SET is_active = ${!currentStatus}, updated_at = NOW() WHERE id = ${id}`

    revalidatePath('/')
    revalidatePath('/catalog')
    revalidatePath('/admin')
  } catch (error: any) {
    console.error('Error al alternar visibilidad:', error)
    throw new Error(error.message || 'Error al alternar la visibilidad')
  }
}

export async function toggleProductFeaturedDb(id: string, currentStatus: boolean) {
  try {
    await sql`UPDATE products SET featured = ${!currentStatus}, updated_at = NOW() WHERE id = ${id}`

    revalidatePath('/')
    revalidatePath('/catalog')
    revalidatePath('/admin')
  } catch (error: any) {
    console.error('Error al alternar destacado:', error)
    throw new Error(error.message || 'Error al alternar destacado')
  }
}

export async function uploadProductImageDb(formData: FormData): Promise<string> {
  try {
    const file = formData.get('file') as File
    if (!file) throw new Error('No se proporcionó ningún archivo')

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
    const filePath = `products/${fileName}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { error } = await supabase.storage
      .from('products-bucket')
      .upload(filePath, buffer, {
        contentType: file.type,
        duplex: 'half',
      })

    if (error) throw new Error(`Error de Supabase Storage: ${error.message}`)

    const { data: publicUrlData } = supabase.storage
      .from('products-bucket')
      .getPublicUrl(filePath)

    return publicUrlData.publicUrl
  } catch (error: any) {
    console.error('Error al subir imagen a Supabase Storage:', error)
    throw new Error(error.message || 'Error al subir la imagen')
  }
}

export async function getProductByIdDb(id: string) {
  try {
    const rows = await sql`SELECT * FROM products WHERE id = ${id}`
    if (rows.length === 0) return null
    const row = rows[0]
    return {
      id: row.id,
      name: row.name,
      brand: row.brand,
      sku: row.sku,
      category: row.category_id,
      price: Number(row.price),
      image: row.image,
      stock: Number(row.stock),
      featured: Boolean(row.featured),
      is_active: row.is_active !== undefined ? Boolean(row.is_active) : true,
      description: row.description,
    }
  } catch (error) {
    console.error('Error al obtener producto por ID:', error)
    return null
  }
}

export async function createCategoryDb(data: { id: string; label: string; short: string }) {
  try {
    const id = data.id.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    await sql`
      INSERT INTO categories (id, label, short)
      VALUES (${id}, ${data.label.trim()}, ${data.short.trim()})
    `
    revalidatePath('/')
    revalidatePath('/catalog')
    revalidatePath('/admin')
  } catch (error: any) {
    console.error('Error al crear categoría:', error)
    throw new Error(error.message || 'Error al crear la categoría')
  }
}

export async function updateCategoryDb(id: string, data: { label: string; short: string }) {
  try {
    await sql`
      UPDATE categories SET
        label = ${data.label.trim()},
        short = ${data.short.trim()}
      WHERE id = ${id}
    `
    revalidatePath('/')
    revalidatePath('/catalog')
    revalidatePath('/admin')
  } catch (error: any) {
    console.error('Error al actualizar categoría:', error)
    throw new Error(error.message || 'Error al actualizar la categoría')
  }
}

export async function deleteCategoryDb(id: string) {
  try {
    // Verificar si hay productos asignados a esta categoría antes de borrar
    const countResult = await sql`SELECT COUNT(*)::int as count FROM products WHERE category_id = ${id}`
    if (countResult[0].count > 0) {
      throw new Error('No se puede eliminar la categoría porque hay productos asociados a ella.')
    }

    await sql`DELETE FROM categories WHERE id = ${id}`
    revalidatePath('/')
    revalidatePath('/catalog')
    revalidatePath('/admin')
  } catch (error: any) {
    console.error('Error al eliminar categoría:', error)
    throw new Error(error.message || 'Error al eliminar la categoría')
  }
}
