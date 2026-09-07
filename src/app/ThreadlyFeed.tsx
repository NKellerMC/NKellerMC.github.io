import { useMemo, useRef, useState } from 'react';
import { threadlyPosts } from '../content/threadly';

type IconName = 'heart' | 'message' | 'bookmark' | 'search' | 'inbox' | 'more' | 'sound' | 'mute' | 'send';

const people = [
  ['Lia Maret', '@lia.maret'], ['Ivo Sen', '@ivo.sen'], ['Nara Vell', '@naravell'],
  ['Teo Arin', '@teo.arin'], ['Mira Sol', '@mirasol'], ['Cael Or', '@cael.or'],
  ['Rui Vale', '@ruivale'], ['Lena Mar', '@lenamar'], ['Noa Teren', '@noa.teren'],
  ['Ari Voss', '@arivoss'], ['Bela Nor', '@belanor'], ['Eli Fer', '@elifer'],
  ['Tali Moss', '@talimoss'], ['Nilo Ver', '@nilover'], ['Cora Senn', '@corasenn'],
  ['Mavi Ler', '@maviler'], ['Davi Orla', '@daviorla'], ['Suri Val', '@surival'],
  ['Téo Lume', '@teolume'], ['Ina Rell', '@inarell'], ['Gael Nori', '@gaelnori'],
  ['Luma Venn', '@lumavenn'], ['Beni Sal', '@benisal'], ['Maia Tor', '@maiator'],
] as const;

const storyPeople = people.slice(0, 10);

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
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function Clip({ poster, src, english }: { poster: string; src: string; english: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play(); else video.pause();
  };
  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    if (video.paused) void video.play();
  };
  return <div className="threadly-video-wrap">
    <video ref={videoRef} muted={muted} loop playsInline preload="metadata" poster={poster} onClick={togglePlayback}>
      <source src={src} type="video/mp4" />
    </video>
    <button className={`threadly-sound ${muted ? '' : 'sound-on'}`} type="button" onClick={toggleSound} aria-label={muted ? (english ? 'Turn sound on' : 'Ativar som') : (english ? 'Mute' : 'Desativar som')}>
      <Icon name={muted ? 'mute' : 'sound'} />
    </button>
  </div>;
}

export function ThreadlyFeed({ english }: { english: boolean }) {
  const [filter, setFilter] = useState<'all' | 'clips'>('all');
  const [liked, setLiked] = useState<Set<number>>(() => new Set());
  const [saved, setSaved] = useState<Set<number>>(() => new Set());
  const visible = useMemo(() => threadlyPosts.map((post, index) => ({ post, index })).filter(({ post }) => filter === 'all' || post.clip), [filter]);

  const toggleSet = (setter: React.Dispatch<React.SetStateAction<Set<number>>>, index: number) => setter((current) => {
    const next = new Set(current);
    if (next.has(index)) next.delete(index); else next.add(index);
    return next;
  });

  return <div className="threadly-react">
    <header className="threadly-bar">
      <span className="threadly-brand"><img src="assets/icons/apps/threadly.svg" alt="" /><strong>Threadly</strong></span>
      <button className="threadly-top-action" type="button" aria-label={english ? 'Search' : 'Buscar'}><Icon name="search" /></button>
      <button className="threadly-top-action" type="button" aria-label={english ? 'Messages' : 'Mensagens'}><Icon name="inbox" /></button>
    </header>
    <div className="threadly-stories" aria-label={english ? 'Stories' : 'Stories'}>
      {storyPeople.map(([name, handle], index) => <button className="threadly-story" type="button" key={handle}>
        <span className="threadly-story-ring"><span style={{ '--avatar-hue': 326 + (index * 19) % 72 } as React.CSSProperties}>{name.charAt(0)}</span></span>
        <small>{name.split(' ')[0]}</small>
      </button>)}
    </div>
    <nav className="threadly-tabs" role="tablist" aria-label={english ? 'Threadly feed' : 'Feed do Threadly'}>
      <button className={filter === 'all' ? 'active' : ''} type="button" role="tab" aria-selected={filter === 'all'} onClick={() => setFilter('all')}>{english ? 'For you' : 'Para você'}</button>
      <button className={filter === 'clips' ? 'active' : ''} type="button" role="tab" aria-selected={filter === 'clips'} onClick={() => setFilter('clips')}>{english ? 'Clips' : 'Clipes'}</button>
    </nav>
    <div className="threadly-feed" aria-label={english ? '100 Threadly posts' : '100 publicações do Threadly'}>
      <button className="threadly-composer" type="button"><span className="threadly-compose-mark">+</span><span>{english ? 'Share something…' : 'Compartilhe alguma coisa…'}</span><Icon name="send" /></button>
      <div className="threadly-feed-count"><span>{english ? 'people talking now' : 'pessoas conversando agora'}</span><b>{visible.length} {english ? 'posts' : 'publicações'}</b></div>
      {visible.map(({ post, index }) => {
        const [name, handle] = people[(index * 7 + 3) % people.length];
        const isLiked = liked.has(index);
        const isSaved = saved.has(index);
        return <article className={`threadly-post${post.clip ? ' threadly-video-post' : ''}`} data-threadly-kind={post.clip ? 'clips' : 'text'} key={index}>
          <header>
            <span className="threadly-avatar" style={{ '--avatar-hue': 326 + (index * 17) % 72 } as React.CSSProperties}>{name.charAt(0)}</span>
            <span className="threadly-person"><strong>{name}</strong><small>{handle} · {index < 8 ? `${index + 2} min` : `${Math.floor(index / 7) + 1} h`}</small></span>
            <button type="button" aria-label={english ? 'More options' : 'Mais opções'}><Icon name="more" /></button>
          </header>
          <p>{english ? post.en : post.pt}</p>
          {post.clip && <Clip {...post.clip} english={english} />}
          <footer>
            <button className={isLiked ? 'is-active' : ''} type="button" aria-pressed={isLiked} onClick={() => toggleSet(setLiked, index)}><Icon name="heart" /><span>{17 + (index * 37) % 481 + (isLiked ? 1 : 0)}</span></button>
            <button type="button"><Icon name="message" /><span>{2 + (index * 11) % 64}</span></button>
            <button className={`threadly-save${isSaved ? ' is-active' : ''}`} type="button" aria-pressed={isSaved} aria-label={english ? 'Save' : 'Salvar'} onClick={() => toggleSet(setSaved, index)}><Icon name="bookmark" /></button>
          </footer>
        </article>;
      })}
    </div>
  </div>;
}
