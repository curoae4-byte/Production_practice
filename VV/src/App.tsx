import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Preloader from './components/Preloader'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'
import Footer from './components/Footer'

// gsap + scrolltrigger: скролл-сцены (hero/about/contact) + синк с lenis
gsap.registerPlugin(ScrollTrigger)

function App() {
  //  загрузка/скролл/якоря
  const [loading, setLoading] = useState(true)
  const lenisRef = useRef<Lenis | null>(null)
  const location = useLocation()
  const skipInitialHashScrollRef = useRef(true)

  //  возвращаемся наверх (важно для старта после прелоадера)
  const resetToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  useEffect(() => {
    // инициализируем плавный скролл
    const lenis = new Lenis({
      duration: 1.65,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 0.78,
      touchMultiplier: 0.9,
      syncTouch: true,
    })
    lenisRef.current = lenis

    // scrolltrigger должен понимать, что скролл крутит lenis
    lenis.on('scroll', ScrollTrigger.update)

    // прокидываем время в lenis через ticker gsap
    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onTick)

    // чтобы не было странных "рывков" при лаге
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      lenisRef.current = null
      gsap.ticker.remove(onTick)
    }
  }, [])

  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    let unlockTimer: number | null = null

    if (loading) {
      // пока прелоадер — скролл стопаем и фиксируем страницу
      lenisRef.current?.stop()
      lenisRef.current?.scrollTo(0, { immediate: true, force: true })
      resetToTop()
      html.style.overflow = 'hidden'
      body.style.overflow = 'hidden'
      body.style.touchAction = 'none'
      return
    }

    // после прелоадера стартуем с hero
    resetToTop()
    lenisRef.current?.scrollTo(0, { immediate: true, force: true })

    // мягко включаем скролл после старта анимации появления
    unlockTimer = window.setTimeout(() => {
      lenisRef.current?.start()
      html.style.overflow = ''
      body.style.overflow = ''
      body.style.touchAction = ''
      // обновляем scrolltrigger после появления, иначе pin в about может поехать
      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 1000)
    }, 420)

    return () => {
      if (unlockTimer) window.clearTimeout(unlockTimer)
      html.style.overflow = ''
      body.style.overflow = ''
      body.style.touchAction = ''
    }
  }, [loading])

  useEffect(() => {
    if (loading) return

    // после прелоадера не прыгаем сразу к hash, чтобы старт всегда был с hero
    if (skipInitialHashScrollRef.current) {
      skipInitialHashScrollRef.current = false
      return
    }

    // якоря из шапки: /#services, /#contact
    const hash = location.hash.replace('#', '')
    if (!hash) return

    const target = document.getElementById(hash)
    if (!target) return

    // учитываем фиксированный header, чтобы секция не пряталась под ним
    const headerOffset = 100
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top, behavior: 'smooth' })
  }, [loading, location.hash])

  return (
    <main className="bg-[#080808] text-white selection:bg-[#EB0000] selection:text-white">
      {loading && <Preloader onComplete={() => {
        // прелоадер закончен — показываем сайт
        resetToTop()
        setLoading(false)
      }} />}

      {!loading && <Header />}

      {/* основной контент, с мягким reveal после прелоадера */}
      <div className={`app-shell ${loading ? '' : 'app-shell--ready'}`} aria-hidden={loading}>
        <div className="relative">
          <Hero />
          <About />
          <Portfolio />
          <Contact />
          <Footer />
        </div>
      </div>
    </main>
  )
}

export default App
