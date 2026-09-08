import { useRef, useState } from 'react';
import { threadlyPosts } from '../content/threadly';

type IconName = 'heart' | 'message' | 'bookmark' | 'search' | 'inbox' | 'more' | 'sound' | 'mute' | 'send' | 'home' | 'clip' | 'plus' | 'bell' | 'user' | 'repeat';

const people = [
  ['Lia Maret', '@lia.maret'], ['Ivo Sen', '@ivo.sen'], ['Nara Vell', '@naravell'], ['Teo Arin', '@teo.arin'],
  ['Mira Sol', '@mirasol'], ['Cael Or', '@cael.or'], ['Rui Vale', '@ruivale'], ['Lena Mar', '@lenamar'],
  ['Noa Teren', '@noa.teren'], ['Ari Voss', '@arivoss'], ['Bela Nor', '@belanor'], ['Eli Fer', '@elifer'],
  ['Tali Moss', '@talimoss'], ['Nilo Ver', '@nilover'], ['Cora Senn', '@corasenn'], ['Mavi Ler', '@maviler'],
  ['Davi Orla', '@daviorla'], ['Suri Val', '@surival'], ['Téo Lume', '@teolume'], ['Ina Rell', '@inarell'],
] as const;

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    heart: <path d="M20.8 4.8a5.4 5.4 0 0 0-7.7 0L12 5.9l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7l1.1 1.1L12 21l7.7-7.4a5.4 5.4 0 0 0 1.1-8.8Z" />,
    message: <path d="M20.5 15.2a4 4 0 0 1-4 4H8L3.5 22V7.5a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4Z" />,
    bookmark: <path d="M6.5 4h11v16.5L12 17l-5.5 3.5Z" />,
    search: <><circle cx="10.5" cy="10.5" r="6.2" /><path d="m15 15 4.5 4.5" /></>,
    inbox: <><path d="M4 5h16v14H4Z" /><path d="m5 7 7 6 7-6" /></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
    sound: <><path d="M11 5 6.5 9H3v6h3.5l4.5 4Z" /><path d="M15 9.5a4 4 0 0 1 0 5M17.5 7a7.5 7.5 0 0 1 0 10" /></>,
    mute: <><path d="M11 5 6.5 9H3v6h3.5l4.5 4Z" /><path d="m15 9 6 6m0-6-6 6" /></>,
    send: <><path d="m4 5 16 7-16 7 2-7Z" /><path d="M6 12h11" /></>,
    home: <><path d="m4 10 8-6 8 6v10H4Z" /><path d="M9 20v-6h6v6" /></>,
    clip: <><rect x="4" y="4" width="16" height="16" rx="4" /><path d="m10 8 6 4-6 4Z" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    bell: <><path d="M6 10a6 6 0 0 1 12 0v5l2 2H4l2-2Z" /><path d="M10 20h4" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
    repeat: <><path d="m17 2 4 4-4 4" /><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4" /><path d="M21 13v2a3 3 0 0 1-3 3H3" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function Clip({ poster, src, english }: { poster: string; src: string; english: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const play = () => { const video = ref.current; if (video) video.paused ? void video.play() : video.pause(); };
  const sound = () => { const video = ref.current; if (!video) return; video.muted = !video.muted; setMuted(video.muted); if (video.paused) void video.play(); };
  return <div className="threadly-video-wrap">
    <video ref={ref} muted={muted} loop playsInline preload="metadata" poster={poster} onClick={play}><source src={src} type="video/mp4" /></video>
    <button className={`threadly-sound ${muted ? '' : 'sound-on'}`} type="button" onClick={sound} aria-label={muted ? (english ? 'Turn sound on' : 'Ativar som') : (english ? 'Mute' : 'Desativar som')}><Icon name={muted ? 'mute' : 'sound'} /></button>
  </div>;
}

export function ThreadlyFeed({ english }: { english: boolean }) {
  const [filter, setFilter] = useState<'all' | 'clips'>('all');
  const [liked, setLiked] = useState<Set<number>>(() => new Set());
  const [saved, setSaved] = useState<Set<number>>(() => new Set());
  const visible = filter === 'clips' ? threadlyPosts.map((post, index) => ({ post, index })).filter(({ post }) => post.clip) : threadlyPosts.map((post, index) => ({ post, index }));
  const toggle = (setter: React.Dispatch<React.SetStateAction<Set<number>>>, index: number) => setter(current => { const next = new Set(current); next.has(index) ? next.delete(index) : next.add(index); return next; });

  return <div className="threadly-react">
    <header className="threadly-bar">
      <span className="threadly-brand"><span className="threadly-brand-mark"><img src="assets/icons/apps/threadly.svg" alt="" /></span><strong>Threadly</strong></span>
      <button className="threadly-top-action" type="button" aria-label={english ? 'Search' : 'Pesquisar'}><Icon name="search" /></button>
      <button className="threadly-top-action" type="button" aria-label={english ? 'Messages' : 'Mensagens'}><Icon name="inbox" /></button>
    </header>

    <main className="threadly-scroll">
      <section className="threadly-stories" aria-label="Stories">
        {people.slice(0, 9).map(([name, handle], index) => <button className="threadly-story" type="button" key={handle}>
          <span className="threadly-story-ring"><span style={{ '--avatar-hue': 326 + (index * 23) % 72 } as React.CSSProperties}>{name[0]}</span></span>
          <small>{name.split(' ')[0]}</small>
        </button>)}
      </section>

      <section className="threadly-page-head">
        <span>{english ? 'YOUR FEED' : 'SEU FEED'}</span>
        <h1>{filter === 'clips' ? (english ? 'Clips' : 'Clipes') : (english ? 'For you' : 'Para você')}</h1>
      </section>

      <button className="threadly-composer" type="button"><span className="threadly-avatar threadly-me">V</span><span>{english ? 'Share an idea, photo or clip…' : 'Compartilhe uma ideia, foto ou clipe…'}</span><Icon name="plus" /></button>

      <section className="threadly-feed" aria-label={filter === 'all' ? (english ? '100 Threadly posts' : '100 publicações do Threadly') : (english ? 'Threadly clips' : 'Clipes do Threadly')}>
        {visible.map(({ post, index }) => {
          const [name, handle] = people[(index * 7 + 3) % people.length];
          const isLiked = liked.has(index), isSaved = saved.has(index);
          return <article className={`threadly-post${post.clip ? ' threadly-video-post' : ''}`} data-threadly-kind={post.clip ? 'clips' : 'text'} key={index}>
            <span className="threadly-avatar" style={{ '--avatar-hue': 326 + (index * 17) % 72 } as React.CSSProperties}>{name[0]}</span>
            <div className="threadly-post-main">
              <header><span className="threadly-person"><strong>{name}</strong><small>{handle} · {index < 10 ? `${index + 2} min` : `${Math.floor(index / 8) + 1} h`}</small></span><button type="button" aria-label={english ? 'More options' : 'Mais opções'}><Icon name="more" /></button></header>
              <p>{english ? post.en : post.pt}</p>
              {post.clip && <Clip {...post.clip} english={english} />}
              <footer>
                <button className={isLiked ? 'is-active' : ''} type="button" aria-pressed={isLiked} onClick={() => toggle(setLiked, index)}><Icon name="heart" /><span>{17 + (index * 37) % 481 + (isLiked ? 1 : 0)}</span></button>
                <button type="button"><Icon name="message" /><span>{2 + (index * 11) % 64}</span></button>
                <button type="button" aria-label={english ? 'Repost' : 'Republicar'}><Icon name="repeat" /></button>
                <button className={`threadly-save${isSaved ? ' is-active' : ''}`} type="button" aria-pressed={isSaved} aria-label={english ? 'Save' : 'Salvar'} onClick={() => toggle(setSaved, index)}><Icon name="bookmark" /></button>
              </footer>
            </div>
          </article>;
        })}
      </section>
    </main>

    <nav className="threadly-mobile-nav" aria-label={english ? 'Threadly navigation' : 'Navegação do Threadly'}>
      <button className={filter === 'all' ? 'active' : ''} type="button" aria-label={english ? 'Home' : 'Início'} onClick={() => setFilter('all')}><Icon name="home" /></button>
      <button className={filter === 'clips' ? 'active' : ''} type="button" aria-label={english ? 'Clips' : 'Clipes'} onClick={() => setFilter('clips')}><Icon name="clip" /></button>
      <button className="threadly-create" type="button" aria-label={english ? 'Create' : 'Criar'}><Icon name="plus" /></button>
      <button type="button" aria-label={english ? 'Activity' : 'Atividade'}><Icon name="bell" /></button>
      <button type="button" aria-label={english ? 'Profile' : 'Perfil'}><Icon name="user" /></button>
    </nav>
  </div>;
}
