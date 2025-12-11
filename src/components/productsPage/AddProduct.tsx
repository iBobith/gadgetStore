"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/AddProd.module.css";

export default function AddProduct() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [year, setYear] = useState<number | string>(new Date().getFullYear());
  const [ram, setRam] = useState("");
  const [warranty, setWarranty] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  function reset() {
    setTitle("");
    setShortDescription("");
    setLongDescription("");
    setPrice("");
    setYear(new Date().getFullYear());
    setRam("");
    setWarranty("");
    setFile(null);
  }

  function readFileAsDataURL(file: File) {
    return new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result as string);
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }

  function sanitizeInput(input: string): string {
    return input
      .replace(/['"`;]/g, "")
      .replace(/--/g, "")
      .replace(/\\/g, "")
      .replace(/\b(SELECT|INSERT|DELETE|UPDATE|DROP|CREATE|ALTER|EXEC)\b/gi, "")
      .trim();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageData: string | undefined;
      if (file) imageData = await readFileAsDataURL(file);

      const payload: Record<string, unknown> = {
        title: sanitizeInput(title),
        price: price === "" ? 0 : Number(price),
        short_description: sanitizeInput(shortDescription),
        long_description: sanitizeInput(longDescription),
        year: typeof year === "number" ? year : Number(year),
        RAM: sanitizeInput(ram),
        warranty_period: sanitizeInput(warranty),
      };

      if (imageData) payload.image = imageData;

      const listRes = await fetch(`${apiBase}/products`);
      if (!listRes.ok)
        throw new Error(
          `Failed to fetch products for id generation: ${listRes.status}`
        );
      const list = await listRes.json();
      const maxId = Array.isArray(list)
        ? list.reduce((max: number, item: Record<string, unknown>) => {
            const idNum = Number(item.id as unknown as number);
            if (!Number.isFinite(idNum) || Number.isNaN(idNum)) return max;
            return Math.max(max, idNum);
          }, 0)
        : 0;

      (payload as Record<string, unknown>).id = String(maxId + 1);

      const res = await fetch(`${apiBase}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      reset();
      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to add product. See console for details.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className={styles.container}>
        <button onClick={() => setOpen(true)} className={styles.addButton}>
          + ADD NEW PRODUCT
        </button>
      </div>

      {open && (
        <div className={styles.modalWrap}>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />

          <form
            onSubmit={handleSubmit}
            className={styles.modal}
            role="dialog"
            aria-modal="true"
          >
            <div className={styles.formGrid}>
              <input
                required
                placeholder="Title"
                aria-label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
              />
              <input
                placeholder="Short description"
                aria-label="Short description"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className={styles.input}
              />
              <input
                placeholder="Long description"
                aria-label="Long description"
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                className={styles.input}
              />
              <input
                required
                placeholder="Price"
                aria-label="Price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={styles.input}
              />
              <input
                placeholder="Year"
                aria-label="Year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={styles.input}
              />
              <input
                placeholder="RAM (e.g. 8GB)"
                aria-label="RAM"
                value={ram}
                onChange={(e) => setRam(e.target.value)}
                className={styles.input}
              />
              <input
                placeholder="Warranty period"
                aria-label="Warranty period"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                className={styles.input}
              />
              <input
                type="file"
                accept="image/*"
                aria-label="Image upload"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className={styles.inputFile}
              />
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={styles.submitButton}
              >
                Add product
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
