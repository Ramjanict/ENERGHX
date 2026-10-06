"use client";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* ─── Types ─────────────────────────────────────────────── */
interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
}

/* ─── Variants ───────────────────────────────────────────── */
const cardVariant: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.5 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

const iconPop: Variants = {
  hidden: { scale: 0.5, opacity: 0, rotate: -20 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      delay: 0.3,
      type: "spring" as const,
      stiffness: 260,
      damping: 18,
    },
  },
};

const crossDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { delay: 0.85, duration: 0.4, ease: "easeOut" as const },
  },
};

/* ─── Component ──────────────────────────────────────────── */
const Cancel = () => {
  const [particles, setParticles] = useState<FloatingParticle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 3,
        size: 2 + Math.random() * 4,
      })),
    );
  }, []);

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ background: "#0a0606", fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
      `}</style>

      {/* ── Ambient glows ── */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 50% 30%, rgba(239,68,68,0.12) 0%, transparent 65%)," +
              "radial-gradient(ellipse 40% 40% at 20% 70%, rgba(185,28,28,0.08) 0%, transparent 60%)," +
              "radial-gradient(ellipse 35% 35% at 80% 75%, rgba(239,68,68,0.05) 0%, transparent 55%)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(239,68,68,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.8) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* ── Floating dim particles ── */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "rgba(239,68,68,0.3)",
          }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{
            delay: p.delay,
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut" as const,
          }}
        />
      ))}

      {/* ── Card ── */}
      <div
        className="relative z-10 w-full mx-auto px-6"
        style={{ maxWidth: 500 }}
      >
        <motion.div
          className="flex flex-col w-full rounded-3xl px-14 py-14"
          style={{
            background:
              "linear-gradient(160deg, rgba(83,20,20,0.55) 0%, rgba(10,6,6,0.92) 100%)",
            border: "1px solid rgba(239,68,68,0.2)",
            backdropFilter: "blur(36px)",
            WebkitBackdropFilter: "blur(36px)",
            boxShadow:
              "0 32px 96px rgba(0,0,0,0.65), 0 0 0 1px rgba(239,68,68,0.08)",
          }}
          variants={cardVariant}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={stagger} initial="hidden" animate="visible">
            {/* ── X Icon ── */}
            <motion.div
              className="mb-10 flex items-center justify-center rounded-full relative"
              style={{
                width: 100,
                height: 100,
                background: "linear-gradient(145deg, #7f1d1d, #991b1b)",
                border: "2px solid rgba(239,68,68,0.4)",
                boxShadow: "0 0 48px rgba(239,68,68,0.22)",
              }}
              variants={iconPop}
              initial="hidden"
              animate="visible"
            >
              {/* Outer halo */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  inset: -9,
                  border: "1.5px solid rgba(239,68,68,0.12)",
                }}
              />
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: "2px solid rgba(239,68,68,0.45)" }}
                animate={{ scale: [1, 1.45, 1], opacity: [0.5, 0, 0.5] }}
                transition={{
                  duration: 2.8,
                  delay: 1.3,
                  repeat: Infinity,
                  ease: "easeInOut" as const,
                }}
              />
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <motion.path
                  d="M14 14L30 30"
                  stroke="#f87171"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  variants={crossDraw}
                  initial="hidden"
                  animate="visible"
                />
                <motion.path
                  d="M30 14L14 30"
                  stroke="#f87171"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  variants={{
                    hidden: { pathLength: 0, opacity: 0 },
                    visible: {
                      pathLength: 1,
                      opacity: 1,
                      transition: {
                        delay: 1.1,
                        duration: 0.35,
                        ease: "easeOut" as const,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                />
              </svg>
            </motion.div>

            {/* Eyebrow */}
            <motion.p
              variants={fadeUp}
              className="mb-3 text-xs font-semibold uppercase"
              style={{ color: "#f87171", letterSpacing: "0.18em" }}
            >
              Transaction Failed
            </motion.p>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="mb-6"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 52,
                color: "#fff1f2",
                lineHeight: 1.06,
              }}
            >
              Payment
              <br />
              <em style={{ color: "#f87171", fontStyle: "italic" }}>
                Cancelled.
              </em>
            </motion.h1>

            {/* Body */}
            <motion.p
              variants={fadeUp}
              style={{
                fontSize: 15,
                color: "rgba(255,241,242,0.42)",
                fontWeight: 300,
                lineHeight: 1.75,
                maxWidth: 300,
              }}
            >
              Your payment was not completed. No charges have been made to your
              account.
            </motion.p>

            {/* Divider */}
            <motion.div
              variants={fadeUp}
              className="my-8 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(239,68,68,0.15), transparent)",
              }}
            />

            {/* Info row */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl px-5 py-4 mb-8 flex items-start gap-3"
              style={{
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.14)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{ flexShrink: 0, marginTop: 2 }}
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="#f87171"
                  strokeWidth="1.4"
                />
                <path
                  d="M8 5v4"
                  stroke="#f87171"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <circle cx="8" cy="11.5" r="0.75" fill="#f87171" />
              </svg>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,241,242,0.45)",
                  lineHeight: 1.65,
                  fontWeight: 300,
                }}
              >
                If this was a mistake or you experienced an issue, please try
                again or reach out to our support team.
              </p>
            </motion.div>

            {/* Buttons */}
            <motion.div variants={fadeUp} className="flex gap-3">
              <Link
                to="/user/all-courses"
                className="relative flex-1 overflow-hidden rounded-2xl py-4 text-sm font-semibold text-center"
                style={{
                  background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                  color: "#fff1f2",
                  boxShadow: "0 4px 28px rgba(220,38,38,0.35)",
                  letterSpacing: "0.025em",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 55%)",
                  }}
                />
                Try Again
              </Link>

              <Link
                to="/user/dashboard"
                className="rounded-2xl px-7 py-4 text-sm font-normal"
                style={{
                  background: "transparent",
                  color: "rgba(255,241,242,0.38)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Go to Dashboard
              </Link>
            </motion.div>

            {/* Trust badge */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-center gap-2 mt-8"
              style={{
                color: "rgba(255,241,242,0.18)",
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
              No charges were made · 256-bit SSL
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cancel;
