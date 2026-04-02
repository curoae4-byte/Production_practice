import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { PageShell } from '../components/PageShell'
import { worksProjects, type WorkProject } from '../data/worksProjects'

gsap.registerPlugin(ScrollTrigger)

// Углы наклона марки на листе рандомные
const STAMP_ROTATIONS_DEG = [-5.5, 3.8, -2.4, 6.2, -4.1, 2.6, -3.3, 4.4] as const

type WorksProjectCardProps = {
  project: WorkProject
  index: number
  isActive: boolean
  onActivate: () => void
  onDeactivate: () => void
  stampRotate: number
}

// Наклон от курсора 
const WorksProjectCard = ({
  project,
  index,
  isActive,
  onActivate,
  onDeactivate,
  stampRotate,
}: WorksProjectCardProps) => {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const mouseXSpring = useSpring(mx, { stiffness: 260, damping: 38, restDelta: 0.0005 })
  const mouseYSpring = useSpring(my, { stiffness: 260, damping: 38, restDelta: 0.0005 })

  // Лёгкий наклон
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['-2.5deg', '2.5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['2.5deg', '-2.5deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const w = rect.width
    const h = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const normalizedX = (mouseX / w - 0.5) * 2
    const normalizedY = (mouseY / h - 0.5) * 2
    mx.set((-normalizedX) / 2)
    my.set((-normalizedY) / 2)
  }

  const handleMouseLeave = () => {
    mx.set(0)
    my.set(0)
    onDeactivate()
  }

  return (
    <motion.article
      className="group relative overflow-hidden rounded-sm border border-white/[0.09] bg-[#111] shadow-[0_8px_40px_rgba(0,0,0,0.55)] [perspective:1000px] cursor-default"
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      initial={false}
      animate={
        isActive
          ? {
              y: -8,
              scale: 1.02,
              boxShadow:
                '0 28px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(235,0,0,0.15)',
            }
          : {
              y: 0,
              scale: 1,
              boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
            }
      }
      transition={{
        type: 'spring',
        stiffness: 420,
        damping: 36,
        mass: 0.85,
        bounce: 0,
      }}
      onMouseEnter={onActivate}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      {/* Марка типа наклейка с фото */}
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <div
          className="border-2 border-dashed border-white/25 bg-[#080808]/90 p-1 shadow-[4px_6px_0_rgba(0,0,0,0.4)] ring-1 ring-white/10"
          style={{
            transform: `rotate(${stampRotate}deg)`,
            clipPath:
              'polygon(2% 0, 98% 0, 100% 2%, 100% 98%, 98% 100%, 2% 100%, 0 98%, 0 2%)',
          }}
        >
          <img
            src={project.image}
            alt={project.title}
            className="h-14 w-14 object-cover sm:h-[4.75rem] sm:w-[4.75rem]"
            loading="lazy"
          />
        </div>
      </div>

      <div
        id={`project-${project.id}`}
        className="relative z-10 px-5 pb-8 pt-7 pr-28 sm:px-8 sm:pb-10 sm:pt-9 sm:pr-36"
        style={{
          transform: 'translateZ(28px)',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
        }}
      >
        <p className="mb-2 font-['Bounded'] text-[10px] uppercase tracking-[0.35em] text-[#EB0000]/90">
          {String(index + 1).padStart(2, '0')}.
        </p>
        <p className="mb-3 max-w-[85%] font-['Bounded'] text-[11px] leading-relaxed text-white/45 sm:text-sm">
          {project.tagline}
        </p>
        <h2 className="font-bounded text-[clamp(1.35rem,3.8vw,2.75rem)] leading-[0.98] tracking-tighter transition-colors duration-300 group-hover:text-[#EB0000]">
          {project.title}
        </h2>

        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 font-['Bounded'] text-[9px] uppercase tracking-[0.16em] text-white/30 sm:mt-8 sm:grid-cols-4 sm:text-[10px] sm:tracking-[0.2em]">
          <div>
            <dt className="mb-1 text-[#EB0000]/80">Клиент</dt>
            <dd className="text-white/50">{project.client}</dd>
          </div>
          <div>
            <dt className="mb-1 text-[#EB0000]/80">Тип</dt>
            <dd className="text-white/50">{project.type}</dd>
          </div>
          <div>
            <dt className="mb-1 text-[#EB0000]/80">Агентство</dt>
            <dd className="text-white/50">{project.agency}</dd>
          </div>
          <div>
            <dt className="mb-1 text-[#EB0000]/80">Дата</dt>
            <dd className="text-white/50">{project.release}</dd>
          </div>
        </dl>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5 sm:mt-8">
          <span className="font-['Bounded'] text-[9px] uppercase tracking-[0.22em] text-white/25 sm:text-[10px]">
            {project.category}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/35 transition-all duration-300 group-hover:border-[#EB0000] group-hover:bg-[#EB0000] group-hover:text-black sm:h-10 sm:w-10">
            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </motion.article>
  )
}

/**
 * Страница портфолио, карточки в колонку на всю ширину PageShell,
 * наклон карточки от курсора как на главной стр
 */
const PortfolioWorksPage = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const lenis = new Lenis({
      duration: 1.55,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 0.95,
      syncTouch: true,
    })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      lenis.destroy()
      lenisRef.current = null
      gsap.ticker.remove(onTick)
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#080808] text-white selection:bg-[#EB0000] selection:text-white">
      <Header />

      <div className="min-w-0 bg-[#080808]">
        {/* вступление */}
        <section className="border-b border-white/10 pb-12 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36">
          <PageShell>
          <div className="max-w-[900px]">
            <p className="mb-4 font-['Bounded'] text-[10px] uppercase tracking-[0.45em] text-[#EB0000] sm:text-xs sm:tracking-[0.5em]">
              ОЦЕНИШЬ?
            </p>
            <h1 className="font-bounded text-[clamp(2rem,6vw,4.25rem)] leading-[0.95] tracking-tighter">
              ПОРТФОЛИО
            </h1>
            <p className="mt-6 max-w-2xl font-['Bounded'] text-sm leading-relaxed text-white/45 sm:text-base">
              Каждый проект — отдельная карточка.
            </p>
            <Link
              to="/"
              className="mt-10 inline-flex items-center gap-2 font-['Bounded'] text-[13px] uppercase tracking-[0.28em] text-white/50 transition-colors hover:text-[#EB0000]"
            >
              <span className="inline-block rotate-180">←</span> На главную
            </Link>
          </div>
          </PageShell>
        </section>

        {/* Карточки */}
        <section className="pb-28 pt-10 sm:pb-32">
          <PageShell>
          <div
            className="w-full [perspective:1400px]"
            onMouseLeave={() => setHoveredId(null)}
          >
            <ul className="relative flex flex-col gap-8 sm:gap-10 lg:gap-12">
              {worksProjects.map((project, index) => {
                const isActive = hoveredId === project.id
                const stampRotate =
                  STAMP_ROTATIONS_DEG[index % STAMP_ROTATIONS_DEG.length]

                return (
                  <motion.li
                    key={project.id}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-6%' }}
                    transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                    style={{
                      zIndex: isActive ? 20 : 1,
                    }}
                  >
                    <WorksProjectCard
                      project={project}
                      index={index}
                      isActive={isActive}
                      onActivate={() => setHoveredId(project.id)}
                      onDeactivate={() => setHoveredId(null)}
                      stampRotate={stampRotate}
                    />
                  </motion.li>
                )
              })}
            </ul>
          </div>
          </PageShell>
        </section>
      </div>

      <Footer />
    </main>
  )
}

export default PortfolioWorksPage
