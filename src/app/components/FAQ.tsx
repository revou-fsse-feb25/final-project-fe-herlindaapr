"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "Bagaimana cara melakukan booking?",
    answer:
      "Booking bisa dilakukan melalui WhatsApp atau form booking di website kami. Pilih layanan, tentukan jadwal, submit, dan konfirmasi telah melakukan booking melalui WhatsApp https://wa.me/6281390488967. Jika tidak melakukan konfirmasi dalam waktu 15 hari, kami akan menganggap booking telah dibatalkan.",
  },
  {
    question: "Apakah bisa booking dadakan (hari H)?",
    answer:
      "Bisa, selama slot masih tersedia. Namun, kami sarankan booking minimal H-1 untuk mengamankan jadwal.",
  },
  {
    question: "Apakah bisa request desain nail art sendiri?",
    answer:
      "Tentu saja! Anda bisa menunjukkan referensi desain, dan kami akan menyesuaikan dengan bahan serta peralatan yang tersedia.",
  },
  {
    question: "Berapa lama pemasangan eyelash extension?",
    answer:
      "Rata-rata 1,5–2 jam, tergantung tipe extension yang dipilih.",
  },
  {
    question: "Bagaimana cara merawat eyelash extension agar tahan lama?",
    answer:
      "Hindari mengucek mata dan jangan gunakan maskara berbahan oil-based",
  },
  {
    question: "Apa saja metode pembayaran yang tersedia di Fuwa Touch?",
    answer:
      "Kami menyediakan pembayaran melalui transfer bank, e-wallet dan Qris. Silahkan konfirmasi kembali melalui kontak kami untuk metode pembayaran yang diinginkan.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-stone-100 py-12 px-6 h-screen">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-stone-700 mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-stone-300 rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-4 py-3 text-left text-stone-700 font-medium hover:bg-stone-200 transition"
              >
                {faq.question}
                <FaChevronDown
                  className={`transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 py-3 text-stone-600 bg-white border-t border-stone-200">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
