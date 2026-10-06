"use client";

import type { Variants } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CommonButton from "../button/CommonButton";

/* ─── Types ─────────────────────────────────────────────── */
interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
}

interface OrderDetail {
  label: string;
  value: string;
}

/* ─── Data ───────────────────────────────────────────────── */
const PARTICLE_COLORS = [
  "#22c55e",
  "#16a34a",
  "#4ade80",
  "#bbf7d0",
  "#86efac",
  "#dcfce7",
];

const ORDER_DETAILS: OrderDetail[] = [
  { label: "Order ID", value: "#ORD-2024-8841" },
  { label: "Date", value: "Feb 28, 2026" },
  { label: "Payment method", value: "Visa •••• 4242" },
  { label: "Billing email", value: "alex@studio.io" },
];

/* ─── Variants ───────────────────────────────────────────── */
const panelLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const panelRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.1,
    },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.55 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

const iconPop: Variants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.35,
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  },
};

const checkDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { delay: 0.95, duration: 0.45, ease: "easeOut" as const },
  },
};

/* ─── Component ──────────────────────────────────────────── */
const Success = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 1.6,
        duration: 2 + Math.random() * 2,
        size: 5 + Math.random() * 9,
        color:
          PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      })),
    );
  }, []);

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ background: "#060e07", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
      `}</style>

      {/* ── Ambient glows ── */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 25% 50%, rgba(34,197,94,0.13) 0%, transparent 65%)," +
              "radial-gradient(ellipse 40% 50% at 75% 20%, rgba(22,163,74,0.09) 0%, transparent 60%)," +
              "radial-gradient(ellipse 35% 40% at 80% 80%, rgba(74,222,128,0.06) 0%, transparent 55%)",
          }}
        />
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(74,222,128,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.6) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* ── Confetti ── */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="fixed top-0 pointer-events-none z-0 rounded-sm"
            style={{
              left: `${p.x}%`,
              width: p.size,
              height: p.size * 0.45,
              background: p.color,
            }}
            initial={{ y: -60, rotate: 0, opacity: 1 }}
            animate={{ y: "110vh", rotate: 680, opacity: [1, 1, 0] }}
            transition={{
              delay: p.delay,
              duration: p.duration,
              ease: "linear" as const,
            }}
          />
        ))}
      </AnimatePresence>

      {/* ── Single centered card ── */}
      <div
        className="relative z-10 w-full mx-auto px-6"
        style={{ maxWidth: 500 }}
      >
        <motion.div
          className="flex flex-col w-full rounded-3xl px-14 py-14"
          style={{
            background:
              "linear-gradient(160deg, rgba(20,83,45,0.6) 0%, rgba(6,14,7,0.92) 100%)",
            border: "1px solid rgba(74,222,128,0.2)",
            backdropFilter: "blur(36px)",
            WebkitBackdropFilter: "blur(36px)",
            boxShadow: "0 32px 96px rgba(0,0,0,0.6)",
          }}
          variants={panelLeft}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={stagger} initial="hidden" animate="visible">
            {/* Check icon */}
            <motion.div
              className="mb-10 flex items-center justify-center rounded-full relative"
              style={{
                width: 100,
                height: 100,
                background: "linear-gradient(145deg, #14532d, #166534)",
                border: "2px solid rgba(74,222,128,0.4)",
                boxShadow: "0 0 48px rgba(34,197,94,0.28)",
              }}
              variants={iconPop}
              initial="hidden"
              animate="visible"
            >
              {/* Outer halo ring */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  inset: -9,
                  border: "1.5px solid rgba(74,222,128,0.14)",
                }}
              />
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: "2px solid rgba(74,222,128,0.5)" }}
                animate={{ scale: [1, 1.45, 1], opacity: [0.6, 0, 0.6] }}
                transition={{
                  duration: 2.6,
                  delay: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut" as const,
                }}
              />
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <motion.path
                  d="M11 22.5L19 30.5L33 14"
                  stroke="#4ade80"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={checkDraw}
                  initial="hidden"
                  animate="visible"
                />
              </svg>
            </motion.div>

            {/* Eyebrow */}
            <motion.p
              variants={fadeUp}
              className="mb-3 text-xs font-semibold uppercase"
              style={{ color: "#4ade80", letterSpacing: "0.18em" }}
            >
              Transaction Complete
            </motion.p>

            {/* Big headline */}
            <motion.h1
              variants={fadeUp}
              className="mb-6"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 56,
                color: "#f0fdf4",
                lineHeight: 1.05,
              }}
            >
              Payment
              <br />
              <em style={{ color: "#4ade80", fontStyle: "italic" }}>
                Successful.
              </em>
            </motion.h1>

            {/* Body copy */}
            <motion.p
              variants={fadeUp}
              style={{
                fontSize: 15,
                color: "rgba(240,253,244,0.44)",
                fontWeight: 300,
                lineHeight: 1.75,
                maxWidth: 290,
              }}
            >
              Your order is confirmed. We will send you a confirmation email.
              <CommonButton className="mt-10">
                <Link to="/user/all-courses">
                  <span className="text-white">Go to Dashboard</span>
                </Link>
              </CommonButton>
            </motion.p>
          </motion.div>

          {/* Bottom trust badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            className="flex items-center gap-2 mt-12"
            style={{
              color: "rgba(240,253,244,0.2)",
              fontSize: 11.5,
              letterSpacing: "0.05em",
            }}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 12 12"
              fill="none"
              style={{ opacity: 0.45, flexShrink: 0 }}
            >
              <rect
                x="1.5"
                y="5"
                width="9"
                height="6.5"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M4 5V3.5a2 2 0 014 0V5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            256-bit SSL · PCI DSS Compliant
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Success;
