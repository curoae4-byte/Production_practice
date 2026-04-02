import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { X } from 'lucide-react'
import { worksProjects as projects } from '../data/worksProjects'
import { PageShell } from './PageShell'

const ProjectCard = ({
  project,
  onOpen,
}: {
  project: typeof projects[0]
  onOpen: () => void
}) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['-7deg', '7deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['7deg', '-7deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const normalizedX = (mouseX / width - 0.5) * 2
    const normalizedY = (mouseY / height - 0.5) * 2

    // Инвертируем вектор, чтобы карточка всегда "отталкивалась" от курсора.
    x.set((-normalizedX) / 2)
    y.set((-normalizedY) / 2)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.01 }}
      className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl border border-white/5 bg-[#111] [perspective:1000px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onOpen}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
    >
      <motion.div
        className="absolute inset-0 z-0 bg-cover bg-center scale-110 filter grayscale group-hover:grayscale-0 transition-[filter] duration-700"
        style={{
          backgroundImage: `url(${project.image})`,
          transformStyle: 'preserve-3d',
          translateZ: '-48px',
        }}
      />

      <div className="absolute inset-0 z-10 bg-black/40 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />

      <div
        className="absolute inset-0 z-20 flex flex-col justify-end p-5 sm:p-6 md:p-8 bg-gradient-to-t from-black via-black/55 to-transparent"
        style={{ transform: 'translateZ(48px)' }}
      >
        <p className="font-['Bounded'] font-light text-[10px] uppercase tracking-[0.28em] text-white mb-2 sm:mb-3">
          {project.category}
        </p>
        <h3 className="max-w-full font-bounded uppercase text-white group-hover:text-[#EB0000] transition-colors leading-[0.95] break-words text-[clamp(1.35rem,4.4vw,3.15rem)] sm:text-[clamp(1.55rem,3.6vw,3.35rem)]">
          {project.title}
        </h3>
      </div>

    </motion.div>
  )
}

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)

  return (
    <section className="relative py-20 sm:py-24 lg:py-32 bg-[#080808] z-10" id="works">
      <PageShell>
        {/* шапка секции */}
        <div className="mb-14 sm:mb-16 lg:mb-24 flex flex-col gap-4 sm:gap-5">
          <span className="text-[10px] sm:text-sm font-['Bounded'] font-light uppercase tracking-[0.32em] sm:tracking-[0.5em] text-[#EB0000]">
            ОЦЕНИШЬ?
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-['Bounded'] font-light tracking-tighter leading-[0.95]">
            ПОРТФОЛИО
          </h2>
          <p className="max-w-2xl text-white/40 font-['Bounded'] font-light text-[11px] sm:text-sm md:text-base tracking-[0.05em] sm:tracking-[0.1em] md:tracking-[0.14em] leading-relaxed break-words normal-case sm:uppercase">
            Наши работы говорят сами за себя.
          </p>
        </div>

        {/* сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {/* кнопка на полный список */}
        <div className="mt-16 sm:mt-20 lg:mt-32 text-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/portfolio"
              className="group relative inline-flex px-8 sm:px-10 md:px-12 py-4 sm:py-5 overflow-hidden"
            >
              <div className="absolute inset-0 border border-[#EB0000] group-hover:bg-[#EB0000] transition-colors duration-500" />
              <span className="relative z-10 text-xs sm:text-sm font-['Bounded'] font-light tracking-[0.22em] sm:tracking-[0.3em] uppercase text-white group-hover:text-black transition-colors duration-500">
                Смотреть все
              </span>
            </Link>
          </motion.div>
        </div>
      </PageShell>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute right-4 top-4 sm:right-8 sm:top-8 z-[1210] rounded-full border border-white/20 p-3 sm:p-4 text-white hover:bg-white hover:text-black transition-colors"
              aria-label="Close video modal"
            >
              <X size={22} />
            </button>

            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shadow-[0_0_50px_rgba(235,0,0,0.2)]"
            >
              <iframe
                src={selectedProject.video}
                title={selectedProject.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 font-bounded text-lg sm:text-2xl uppercase text-white mix-blend-difference drop-shadow-md">
                {selectedProject.title}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Portfolio