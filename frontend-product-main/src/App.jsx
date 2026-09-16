import "./App.css";
import { useState, useEffect } from "react";
import {
  Package,
  SquarePen,
  Trash,
  CirclePlus,
  Pencil,
  PlusCircle,
  X,
} from "lucide-react";

function App() {
  const API_URL = import.meta.env.VITE_API_URL + "/api/products";
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isSubmiting, setIsSubmitting] = useState(false);

  const fetchProduct = async () => {
    setloading(true);
    setError("");
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("ไม่สามารถดึงข้อมูลได้");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    //fetch data from API
    fetchProduct();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(JSON.stringify({ name: name, price: Number(price) }));
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, price: Number(price) }),
      });
      console.log(response);
      if (!response.ok) throw new Error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      setName("");
      setPrice("");
      fetchProduct();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsSubmitting(true);

    try {
      const respone = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, price: Number(price) }),
      });
      if (!respone.ok) throw new Error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === editingId
            ? { ...product, name: name, price: Number(price) }
            : product,
        ),
      );
      setName("");
      setPrice("");
      setEditingId(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("ยืนยันการลบสินค้านี้หรือไม่?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("ลบข้อมูลไม่สำเร็จ");
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id),
      );
      // ถ้ากำลังแก้ไขรายการที่เพิ่งลบอยู่ ให้ยกเลิกโหมดแก้ไขด้วย
      if (editingId === id) {
        cancelEditing();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const startEditing = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setName("");
    setPrice("");
  };

  return (
    <>
      <main className="min-h-screen bg-[#FAF6EE] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <header className="rounded-3xl border-2 border-[#E8DFC8] bg-[#F3ECDA] px-5 py-7 text-[#3A3226] shadow-lg sm:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-2xl border-2 border-[#E8DFC8] bg-white">
                    <Package className="size-7 text-[#3A3226]" />
                  </div>
                  <span className="badge badge-outline rounded-full border-[#C9BB93] text-[#6B5F45]">
                    Product
                  </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Product Management
                </h1>
                <p className="mt-2 max-w-xl text-sm text-[#6B5F45] sm:text-base">
                  จัดการสินค้าและราคาได้อย่างรวดเร็วในที่เดียว
                </p>
              </div>
            </div>
          </header>

          <section className="card mt-6 rounded-3xl border-2 border-[#E8DFC8] bg-white shadow-lg">
            <div className="card-body p-5 sm:p-6">
              <div className="mb-2 flex items-center gap-3">
                <div className="rounded-2xl border border-[#E8DFC8] bg-[#F3ECDA] p-2 text-[#6B5F45]">
                  <CirclePlus className="size-5" />
                </div>
                <div>
                  <h2 className="card-title text-xl text-[#3A3226]">
                    {editingId ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
                  </h2>
                  <p className="text-sm text-[#8A7E64]">
                    กรอกข้อมูลเพื่อ
                    {editingId ? "แก้ไขรายการ" : "เพิ่มรายการเข้าสู่ระบบ"}
                  </p>
                </div>
              </div>

              <form
                className="mt-3 p-3 grid grid-cols-1 gap-4 md:grid-cols-[1fr_0.65fr_auto_auto] md:items-end"
                onSubmit={editingId ? handleUpdateProduct : handleCreateProduct}
              >
                <label className="form-control w-full">
                  <span className="label-text mb-2 font-medium text-[#3A3226]">
                    ชื่อสินค้า
                  </span>
                  <input
                    type="text"
                    className="input input-bordered w-full rounded-2xl border-[#E8DFC8] bg-[#FAF6EE] focus:border-[#C9BB93] focus:outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ชื่อสินค้า เช่น กล้องวิทยุโทรศัพท์มือถือไร้สาย"
                  />
                </label>
                <label className="form-control w-full">
                  <span className="label-text mb-2 font-medium text-[#3A3226]">
                    ราคา (บาท)
                  </span>
                  <input
                    type="text"
                    className="input input-bordered w-full rounded-2xl border-[#E8DFC8] bg-[#FAF6EE] focus:border-[#C9BB93] focus:outline-none"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="ราคา เช่น 1599"
                  />
                </label>
                <button
                  className="btn w-full rounded-2xl border-2 border-[#3A3226] bg-[#3A3226] text-white hover:bg-[#2A2419] md:w-auto"
                  type="submit"
                  disabled={isSubmiting}
                >
                  {isSubmiting ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : editingId ? (
                    <Pencil className="size-4" />
                  ) : (
                    <PlusCircle className="size-4" />
                  )}
                  {isSubmiting
                    ? "กำลังบันทึก..."
                    : editingId
                      ? "บันทึกการแก้ไข"
                      : "บันทึกข้อมูล"}
                </button>
                {editingId && (
                  <button
                    className="btn btn-ghost w-full rounded-2xl border-2 border-[#E8DFC8] text-[#6B5F45] md:w-auto"
                    type="button"
                    onClick={cancelEditing}
                    disabled={isSubmiting}
                  >
                    <X className="size-4" /> ยกเลิก
                  </button>
                )}
              </form>
            </div>
          </section>

          {error && (
            <div className="alert mt-6 rounded-2xl border-2 border-[#E8B4B4] bg-[#FBEAEA] text-[#8A3A3A] shadow-lg">
              <span>เกิดข้อผิดพลาด: {error}</span>
            </div>
          )}

          {loading ? (
            <div className="mt-6 flex min-h-48 items-center justify-center rounded-3xl border-2 border-[#E8DFC8] bg-white shadow-lg">
              <span className="loading loading-spinner loading-xl text-[#6B5F45]" />
              <span className="sr-only">กำลังโหลดข้อมูล...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="card mt-6 rounded-3xl border-2 border-dashed border-[#E8DFC8] bg-white shadow-lg">
              <div className="card-body items-center py-14 text-center">
                <Package className="size-12 text-[#C9BB93]" />
                <h2 className="card-title mt-2 text-[#3A3226]">
                  ยังไม่มีข้อมูลสินค้า
                </h2>
                <p className="text-sm text-[#8A7E64]">
                  เริ่มต้นด้วยการเพิ่มสินค้าใหม่ด้านบน
                </p>
              </div>
            </div>
          ) : (
            <section className="card mt-6 rounded-3xl border-2 border-[#E8DFC8] bg-white shadow-lg overflow-hidden">
              <div className="card-body p-0">
                <div className="flex items-center justify-between px-5 py-5 sm:px-6">
                  <div>
                    <h2 className="card-title text-[#3A3226]">
                      รายการสินค้าทั้งหมด
                    </h2>
                    <p className="text-sm text-[#8A7E64]">
                      มีสินค้า {products.length} รายการ
                    </p>
                  </div>
                  <span className="badge badge-lg rounded-full border-2 border-[#3A3226] bg-[#3A3226] text-white">
                    {products.length}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead className="bg-[#F3ECDA] text-[#3A3226]">
                      <tr>
                        <th>รหัสสินค้า</th>
                        <th>ชื่อ</th>
                        <th>ราคา</th>
                        <th>การจัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((item) => (
                        <tr key={item.id} className="hover:bg-[#FAF6EE]">
                          <td className="font-mono text-xs text-[#8A7E64]">
                            #{item.id}
                          </td>
                          <td className="font-medium text-[#3A3226]">
                            {item.name}
                          </td>
                          <td className="font-bold text-[#3A3226]">
                            {Number(item.price).toLocaleString()}฿
                          </td>
                          <td className="text-right">
                            <button
                              className="btn btn-square btn-ghost btn-sm rounded-xl text-[#6B5F45] hover:bg-[#F3ECDA]"
                              onClick={() => startEditing(item)}
                              aria-label={`แก้ไขข้อมูลสินค้า${item.name}`}
                            >
                              <SquarePen className="size-4" />
                            </button>
                            <button
                              className="btn btn-square btn-ghost btn-sm rounded-xl text-[#B04A4A] hover:bg-[#FBEAEA]"
                              onClick={() => deleteProduct(item.id)}
                              aria-label={`ลบสินค้า${item.name}`}
                            >
                              <Trash className="size-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
