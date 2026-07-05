'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: 'easeOut' as const },
  }),
};

interface TreatmentRow {
  feature: string;
  swedish: string;
  deepTissue: string;
  thai: string;
}

const treatments: TreatmentRow[] = [
  { feature: 'Duration', swedish: '60–90 min', deepTissue: '60–90 min', thai: '60–120 min' },
  { feature: 'Price', swedish: 'K800', deepTissue: 'K1,200', thai: 'K1,100' },
  { feature: 'Pressure', swedish: 'Light – Medium', deepTissue: 'Firm – Deep', thai: 'Moderate – Strong' },
  { feature: 'Best For', swedish: 'Relaxation & Stress', deepTissue: 'Chronic Pain & Tension', thai: 'Flexibility & Energy' },
  { feature: 'Technique', swedish: 'Long flowing strokes', deepTissue: 'Targeted deep pressure', thai: 'Stretching & compression' },
];

const columns = ['swedish', 'deepTissue', 'thai'] as const;

const columnTitles: Record<string, string> = {
  swedish: 'Swedish Massage',
  deepTissue: 'Deep Tissue',
  thai: 'Thai Massage',
};

export default function ComparisonTable() {
  const navigate = useAppStore((s) => s.navigate);

  const handleBook = (treatment: string) => {
    navigate('contact');
  };

  return (
    <section className="section-dark section-padding">
      <div className="container-tinas">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <h2 className="heading-display text-gradient-sexy text-3xl md:text-4xl font-bold mb-3">
            Find Your Perfect Treatment
          </h2>
          <p className="body-serif text-pink-glow/60 text-base max-w-lg mx-auto">
            Compare our most popular treatments to discover which experience
            is right for you.
          </p>
        </motion.div>

        {/* Table card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={1}
          variants={fadeUp}
          className="surface-raised rounded-2xl overflow-hidden"
        >
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-pink-glow/10">
                  <th className="heading-display text-gold text-sm font-semibold tracking-wider uppercase px-6 py-5 w-[140px]">
                    Feature
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="heading-display text-gold text-sm font-semibold tracking-wider uppercase px-6 py-5 text-center"
                    >
                      {columnTitles[col]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {treatments.map((row, rowIdx) => (
                  <motion.tr
                    key={row.feature}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={rowIdx + 2}
                    variants={fadeUp}
                    className="border-b border-pink-glow/5 last:border-b-0 group transition-colors duration-200 hover:bg-white/[0.03]"
                  >
                    <td className="body-serif text-pink-glow/45 text-sm px-6 py-4 font-medium">
                      {row.feature}
                    </td>
                    {columns.map((col) => (
                      <td
                        key={col}
                        className="body-serif text-pink-glow/70 text-sm px-6 py-4 text-center"
                      >
                        {row[col]}
                      </td>
                    ))}
                  </motion.tr>
                ))}
                {/* Book row */}
                <motion.tr
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={treatments.length + 2}
                  variants={fadeUp}
                >
                  <td className="px-6 py-5" />
                  {columns.map((col) => (
                    <td key={col} className="px-6 py-5 text-center">
                      <button
                        onClick={() => handleBook(col)}
                        className="btn-pink text-xs px-5 py-2 rounded-full transition-all hover:shadow-[0_0_16px_rgba(233,30,99,0.35)]"
                      >
                        Book Now
                      </button>
                    </td>
                  ))}
                </motion.tr>
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden p-4 space-y-4">
            {columns.map((col, colIdx) => (
              <motion.div
                key={col}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={colIdx + 2}
                variants={fadeUp}
                className="rounded-xl border border-pink-glow/10 bg-white/[0.02] p-5"
              >
                <h4 className="heading-display text-gold text-base font-semibold mb-4">
                  {columnTitles[col]}
                </h4>
                <div className="space-y-3">
                  {treatments.map((row) => (
                    <div key={row.feature} className="flex justify-between items-center">
                      <span className="body-serif text-pink-glow/45 text-xs">{row.feature}</span>
                      <span className="body-serif text-pink-glow/70 text-xs text-right">{row[col]}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleBook(col)}
                  className="btn-pink w-full text-xs px-5 py-2.5 rounded-full mt-4 transition-all hover:shadow-[0_0_16px_rgba(233,30,99,0.35)]"
                >
                  Book Now
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}