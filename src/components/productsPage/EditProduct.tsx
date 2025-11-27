"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import styles from "../styles/AddProd.module.css";

type Product = {
  id?: number | string;
  title?: string;
  price?: number;
  image?: string;
  short_description?: string;
  shortDescription?: string;
  long_description?: string;
  year?: number | string;
  RAM?: string;
  warranty_period?: string;
};

type Props = {
  product: Product;
  onClose?: () => void;
  onSaved?: () => void;
};

export default function EditProduct({ product, onClose, onSaved }: Props) {
  const [open, setOpen] = useState(true);
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

  useEffect(() => {
    if (product) {
      setTitle(product.title ?? "");
      setShortDescription(
        (product.short_description as string) ||
          (product.shortDescription as string) ||
          ""
      );
      setLongDescription((product.long_description as string) || "");
      setPrice(product.price ?? "");
      setYear(product.year ?? new Date().getFullYear());
      setRam((product.RAM as string) || "");
      setWarranty((product.warranty_period as string) || "");
      setFile(null);
      setOpen(true);
    }
  }, [product]);

  function readFileAsDataURL(file: File) {
    return new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result as string);
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      let imageData: string | undefined;
      if (file) imageData = await readFileAsDataURL(file);
      const id = encodeURIComponent(String(product.id));

      const getRes = await fetch(
        `${apiBase.replace(/\/+$/, "")}/products/${id}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );
      const existing = getRes.ok ? await getRes.json().catch(() => ({})) : {};

      const payload: Record<string, unknown> = {
        ...existing,
        title,
        price: price === "" ? 0 : Number(price),
        short_description: shortDescription,
        long_description: longDescription,
        year: typeof year === "number" ? year : Number(year),
        RAM: ram,
        warranty_period: warranty,
      };

      if (imageData) payload.image = imageData;

      const res = await fetch(`${apiBase.replace(/\/+$/, "")}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      setOpen(false);
      if (onSaved) onSaved();
      else router.refresh();
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update product. See console for details.");
    } finally {
      setSubmitting(false);
    }
  }

  const modal = (
    <div className={styles.modalWrap}>
      <div
        className={styles.backdrop}
        onClick={() => {
          setOpen(false);
          if (onClose) onClose();
        }}
      />

      <form
        onSubmit={handleUpdate}
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
            onClick={() => {
              setOpen(false);
              if (onClose) onClose();
            }}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={styles.submitButton}
          >
            {submitting ? "Updating..." : "Update product"}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <>
      {open && typeof document !== "undefined"
        ? createPortal(modal, document.body)
        : null}
    </>
  );
}
