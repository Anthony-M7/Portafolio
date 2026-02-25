import React, { useState, useEffect } from 'react';
// IMPORTANTE: Asegúrate de que la ruta a tu imagen sea correcta.
import logoCircular from './assets/Logo circular.png';

function App() {

  const [videos, setVideos] = useState([]);
  const [projects, setProjects] = useState([]);
  const GITHUB_USERNAME = 'Anthony-M7';
  const selectedRepos = ['stream-deck', 'Lubricantes-Luis-Mora'];
  const excludedRepos = ['Anthony-M7'];

  // Nuevos estados para Filtros y Paginación
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Límite de proyectos por página

  const [searchTerm, setSearchTerm] = useState("");
  
  //Vista del home
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    const fetchYouTubeVideos = async () => {
      // TODO: Reemplaza estas variables con tus datos reales
      const API_KEY = 'AIzaSyBq7WfgqBj0VXLiH4M81S_7GwrpDdoGUgc'; 
      const CHANNEL_ID = 'UCAiRUEt_WVPQRUFCLqK6nQQ'; 

      // if (API_KEY === 'AIzaSyBq7WfgqBj0VXLiH4M81S_7GwrpDdoGUgc') return; // Evita el error si no hay key aún

      try {
        const uploadsPlaylistId = CHANNEL_ID.replace(/^.{2}/, 'UU');
        
        const response = await fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=3&playlistId=${uploadsPlaylistId}&key=${API_KEY}`);
        const data = await response.json();

        // Si YouTube nos devuelve un error (como el 404 por no tener videos)
        if (!response.ok || data.error) {
          console.warn("Canal sin videos públicos aún. Mostrando estado de inicialización.");
          setVideos([]); // Forzamos la lista vacía para mostrar "Próximamente"
          return;
        }

        // Si la respuesta es exitosa y hay videos
        if (data.items && data.items.length > 0) {
          const liveVideos = data.items.map(item => ({
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
            views: 'Nuevo',
            duration: '▶'
          }));
          setVideos(liveVideos);
        } else {
          setVideos([]); // Por si acaso devuelve un arreglo vacío sin error
        }
      } catch (error) {
        console.error("Error de red al conectar con YouTube:", error);
        setVideos([]); // Si se cae el internet, también mostramos el estado vacío
      }
    };

    fetchYouTubeVideos();
  }, []);

  useEffect(() => {
    const fetchGitHubProjects = async () => {
      // if (GITHUB_USERNAME === 'TU_USUARIO_REAL' || GITHUB_USERNAME === 'TU_USUARIO_AQUI') return;

      try {
        // Añadí "?sort=updated" para que siempre salgan los más recientes primero
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        const allRepos = await response.json();

        if (!response.ok) {
           console.error("Error de GitHub:", allRepos.message);
           return;
        }

        // Filtramos SOLO para quitar los "forks" (repositorios clonados de otros)
        const originalRepos = allRepos.filter(repo => !repo.fork && !excludedRepos.includes(repo.name));

        // Formateamos TODOS los repositorios originales
        // AQUÍ VA LA LÓGICA DE TRANSFORMACIÓN
          const transformedProjects = originalRepos.map(repo => {
            // 1. Buscamos el tag oculto [cat:Nombre] en la descripción
            const categoryMatch = repo.description?.match(/\[cat:(.*?)\]/);
            const extractedCategory = categoryMatch ? categoryMatch[1] : 'Otros';
            
            // 2. Limpiamos la descripción para que no se vea el [cat:...] en la web
            const cleanDescription = repo.description?.replace(/\[cat:.*?\]/, '').trim();

            // 3. Retornamos el objeto con los datos que ya usabas + los nuevos campos
            return {
              id: repo.id,
              name: repo.name,
              description: cleanDescription || "Sin descripción", // Usamos la limpia
              category: extractedCategory, // Este es el que usará tu filtro
              url: repo.html_url,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              language: repo.language,
              owner: repo.owner.login,
              updatedAt: repo.updated_at,
              tags: repo.topics // GitHub usa "topics" como tags
            };
          });

        // ORDENAMIENTO: Ordenamos del más nuevo al más viejo usando la fecha
        const sortedProjects = transformedProjects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        setProjects(sortedProjects);

        // Guardamos TODOS en el estado
        setProjects(sortedProjects);
      } catch (error) {
        console.error("Error al conectar con GitHub:", error);
      }
    };

    fetchGitHubProjects();
  }, []);


  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            {/* ================= HERO SECTION (Lo que ya teníamos) ================= */}
            <div className="neo-grid flex items-center relative overflow-hidden min-h-screen">
              {/* Elemento Decorativo Lateral Derecho */}
              <div className="absolute top-0 right-0 h-full w-24 border-l border-white/5 hidden lg:flex flex-col items-center justify-center gap-8 opacity-50 z-20 pointer-events-none">
                <span className="text-xs tracking-widest text-bit-cyan rotate-90 whitespace-nowrap -mt-32">
                  SYSTEM_READY
                </span>
                <div className="w-[1px] h-32 bg-gradient-to-b from-bit-cyan to-transparent"></div>
                <div className="absolute top-[30%] right-8 w-12 h-16 border-t-2 border-r-2 border-bit-cyan opacity-80"></div>
                <span 
                  className="text-vatio-yellow/80 text-xl font-vatio tracking-[0.3em] mt-16"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
                >
                  ビットとバティオ
                </span>
              </div>

              {/* Luces de fondo (Glow) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-20 right-1/4 w-72 h-72 bg-bit-cyan/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-vatio-yellow/5 rounded-full blur-[80px]"></div>
              </div>

              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-20">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                  {/* Text Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-bit-cyan/30 rounded-full bg-bit-cyan/5 mb-6">
                      <span className="w-2 h-2 bg-bit-cyan rounded-full animate-pulse"></span>
                      <span className="text-xs text-bit-cyan font-bold tracking-widest uppercase">System Online</span>
                    </div>
                    
                    <h1 className="text-6xl lg:text-8xl font-black italic tracking-tighter leading-[0.9] mb-6 glitch-text transition-all duration-300">
                      <span className="text-white">BIT</span> <span className="text-bit-cyan">&</span> <br/>
                      <span className="text-vatio-yellow">VATIO</span>
                    </h1>
                    
                    <p className="text-lg lg:text-xl text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed border-l-4 border-vatio-yellow pl-6">
                      Ingeniería real para el mundo digital. <span className="text-white">Entusiasta del hardware</span> y <span className="text-white">desarrollador</span> creando la próxima generación de experiencias web.
                    </p>
                    
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                      <button className="px-8 py-4 border border-vatio-yellow text-vatio-yellow font-bold uppercase tracking-wider hover:bg-vatio-yellow hover:text-black transition-colors">
                        Último Video
                      </button>
                      <button onClick={() => {
                        setCurrentView('archive');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }} className="px-8 py-4 border border-bit-cyan text-bit-cyan font-bold uppercase tracking-wider hover:bg-bit-cyan hover:text-black transition-colors">
                        Ver Proyectos
                      </button>
                    </div>
                  </div>

                  {/* Image Placeholder */}
                  <div className="flex-1 relative">
                    <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-bit-cyan opacity-60"></div>
                    <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-vatio-yellow opacity-60"></div>
                    <div className="relative w-72 h-72 lg:w-[450px] lg:h-[450px] mx-auto bg-black/50 border border-white/10 flex items-center justify-center rounded-lg backdrop-blur-sm">
                      <img src={logoCircular} alt="Bit y Vatio Logo" className="text-gray-500 font-bit p-5 object-contain h-full w-full hover:scale-105 transition-transform duration-500"/>
                      
                      <div className="absolute bottom-4 right-4 z-20 bg-background-dark/90 backdrop-blur border border-bit-cyan px-3 py-1.5 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-bit-cyan rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold tracking-widest font-mono text-bit-cyan">LVL. 99 CREATOR</span>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>

            {/* ================= SECCIÓN VIDEOS ================= */}
            <section className="py-24 bg-[#0F0F0F]" id="videos">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/5 pb-8">
                  <div>
                    <h2 className="text-4xl font-vatio uppercase tracking-tight mb-2 text-white">Ultimos <span className="text-vatio-yellow">Videos</span></h2>
                    <p className="text-gray-400 font-bit text-sm">Tutoriales de progamación, Gadgets, y análisis de tecnología.</p>
                  </div>
                  <a href="https://www.youtube.com/@BitVatio" target='_blank' className="mt-4 md:mt-0 text-vatio-yellow font-bold font-bit text-sm flex items-center gap-2 hover:text-white transition-colors group">
                    Visitar Canal <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {videos.length > 0 ? (
                    // Si HAY videos, mapeamos la lista normal
                    videos.map((video, index) => (
                    <a 
                      key={video.id} 
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group cursor-pointer block"
                    >
                      <div className="relative aspect-video bg-gray-900 border border-white/10 overflow-hidden mb-4 group-hover:border-vatio-yellow transition-colors">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                        <div className="absolute inset-0 bg-vatio-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay"></div>
                        
                        {/* Etiqueta NEW solo en el primer video */}
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-vatio-yellow text-black text-xs font-bold px-2 py-0.5 font-vatio">NEW</div>
                        )}
                        
                        <div className="absolute bottom-0 right-0 bg-black text-bit-cyan font-bit text-xs px-2 py-1 border-t border-l border-white/10">
                          {video.duration}
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-tight group-hover:text-vatio-yellow transition-colors font-vatio">
                        {video.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-xs font-bit text-gray-500 uppercase tracking-wide">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">visibility</span> {video.views}</span>
                        <span>//</span>
                        <span>{video.publishedAt}</span>
                      </div>
                    </a>
                  ))) : (
                    // Si NO HAY videos (lista vacía), mostramos este cuadro de "Próximamente"
                    <div className="col-span-1 md:col-span-3 border border-dashed border-white/20 bg-white/5 p-12 text-center group hover:border-bit-cyan transition-colors">
                      <span className="material-symbols-outlined text-4xl text-gray-500 mb-4 group-hover:text-bit-cyan transition-colors animate-pulse">videocam</span>
                      <h3 className="text-xl font-vatio text-white mb-2">Próximamente...</h3>
                      <p className="text-gray-400 font-bit text-sm">El primer video de Bit & Vatio está en fase de renderizado. Vuelve pronto.</p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => {
                    setCurrentView('videos');
                    setCurrentPage(1); // Resetear a pág 1
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-12 group border border-vatio-yellow/30 px-8 py-3 text-vatio-yellow font-bit text-xs tracking-widest hover:bg-vatio-yellow/10 transition-all"
                >
                  EXPLORAR VIDEOTECA [+]
                </button>
              </div>
            </section>

            {/* ================= SECCIÓN PROYECTOS ================= */}
            <section className="py-24 relative neo-grid" id="projects">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bit-cyan/5 to-transparent pointer-events-none"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-vatio uppercase mb-4 text-white">
                    <span className="text-bit-cyan">{"<"}</span> Proyectos <span className="text-bit-cyan">{"/>"}</span>
                  </h2>
                  <p className="text-gray-400 font-bit text-sm max-w-2xl mx-auto">Proyectos en los que he trabajado.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {projects.length > 0 ? (
                    projects
                      // 1. Filtramos para dejar SOLO los que coincidan con 'selectedRepos'
                      .filter(project => selectedRepos.includes(project.name))
                      // 2. Por seguridad, cortamos a máximo 2 tarjetas
                      .slice(0, 2)
                      // 3. Dibujamos las tarjetas
                      .map((project) => (
                      <a key={project.id} href={project.url} target="_blank" rel="noopener noreferrer" className="relative overflow-hidden bg-[#1E1E1E]/50 border border-white/5 p-8 group hover:border-vatio-yellow transition-all block">
                        {/* Borde izquierdo brillante */}
                        <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-bit-cyan to-transparent opacity-50"></div>
                        
                        <div className="flex justify-between items-start mb-6">
                          <div className="bg-bit-cyan/10 p-3 border border-bit-cyan/20 group-hover:bg-bit-cyan/20 transition-colors">
                            <span className="material-symbols-outlined text-bit-cyan">code</span>
                          </div>
                          <div className="flex gap-4 font-bit text-xs">
                            <span className="flex items-center gap-1 text-vatio-yellow">
                              <span className="material-symbols-outlined text-sm">star</span> {project.stars}
                            </span>
                            <span className="flex items-center gap-1 text-gray-400">
                              <span className="material-symbols-outlined text-sm">fork_right</span> {project.forks}
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-vatio text-white mb-3 group-hover:text-bit-cyan transition-colors truncate">
                          {project.name}
                        </h3>
                        
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed font-bit line-clamp-3">
                          {project.description}
                        </p>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold font-bit px-2 py-1 border border-bit-cyan/30 text-bit-cyan bg-bit-cyan/5">
                            {project.language}
                          </span>
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="col-span-1 md:col-span-2 text-center text-gray-500 font-bit py-8">Cargando Proyectos...</div>
                  )}
                </div>

                {projects.length > 2 && (
                  <div className="flex justify-center mt-12">
                    <button 
                      onClick={() => {
                        setCurrentView('archive');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="group relative flex items-center gap-3 px-8 py-4 bg-transparent border border-bit-cyan/30 text-bit-cyan font-bit text-xs tracking-[0.2em] hover:bg-bit-cyan/10 hover:border-bit-cyan transition-all duration-300"
                    >
                      <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t border-l border-bit-cyan"></div>
                      <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b border-r border-bit-cyan"></div>
                      
                      Ver todos los proyectos
                      <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                        arrow_forward_ios
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* ================= SECCIÓN TECH STACK ================= */}
            <section className="py-24 bg-[#0F0F0F] relative border-t border-white/5" id="skills">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl text-center text-white mb-16 uppercase tracking-widest font-vatio">
                  <span className="text-vatio-yellow">Tech</span> Stack
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {/* Tech Items */}
                  {[
                    { icon: 'data_object', name: 'PYTHON' },
                    { icon: 'javascript', name: 'JAVASCRIPT' },
                    { icon: 'database', name: 'POSTGRES' },
                    { icon: 'html', name: 'HTML+CSS' },
                    { icon: 'cloud', name: 'GOOGLE CLOUD' },
                    { icon: 'terminal', name: 'BASH' }
                  ].map((tech) => (
                    <div key={tech.name} className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/5 hover:border-bit-cyan hover:bg-bit-cyan/5 transition-all group h-32 cursor-default">
                      <span className="material-symbols-outlined text-4xl text-gray-400 group-hover:text-bit-cyan mb-3 transition-colors">{tech.icon}</span>
                      <span className="font-bold font-bit text-xs text-gray-300 text-center">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        );

      case 'archive':
        // 1. LÓGICA DE CÁLCULO (Se ejecuta antes de retornar el diseño)
        const filteredProjects = projects.filter(project => 
          activeFilter === 'Todos' || project.category === activeFilter
        );

        const indexOfLastProject = currentPage * itemsPerPage;
        const indexOfFirstProject = indexOfLastProject - itemsPerPage;
        const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
        const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

        

        // 2. RETORNO DEL DISEÑO
        return (
          <div className="pt-32 pb-24 relative neo-grid bg-[#0a0a0a] min-h-screen animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              
              {/* Cabecera Mis Proyectos */}
              <div className="relative text-center mb-12 flex flex-col items-center pt-14 md:pt-0">
                <button 
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="absolute left-0 top-0 flex items-center gap-2 border border-white/20 text-gray-400 px-4 py-2 font-bit text-xs tracking-widest hover:border-bit-cyan hover:text-bit-cyan transition-colors group"
                >
                  <span className="material-symbols-outlined text-[14px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                  VOLVER AL INICIO
                </button>
                
                <h2 className="text-5xl md:text-7xl font-vatio italic tracking-tighter mb-4">
                  <span className="text-white">Mis</span> <span className="text-bit-cyan drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]">PROYECTOS</span>
                </h2>
                <p className="text-gray-400 font-bit text-sm max-w-2xl mx-auto leading-relaxed">
                  Aquí encontrarás una selección de mis proyectos personales y académicos. Cada uno representa un desafío técnico, desde automatizaciones hasta aplicaciones web.
                </p>
              </div>

              {/* BOTONES DE FILTRO DINÁMICOS */}
              <div className="flex flex-wrap justify-center gap-4 mb-16 font-bit text-xs tracking-widest">
                {['Todos', 'Inteligencia Artificial', 'Desarrollo Web', 'Automatización', 'Herramientas Multimedia'].map(filterName => (
                  <button 
                    key={filterName}
                    onClick={() => {
                      setActiveFilter(filterName);
                      setCurrentPage(1); 
                    }}
                    className={`px-6 py-2 transition-colors border ${
                      activeFilter === filterName 
                        ? 'border-bit-cyan text-bit-cyan bg-bit-cyan/10' 
                        : 'border-white/20 text-gray-500 hover:border-white/50 hover:text-gray-300' 
                    }`}
                  >
                    {filterName}
                  </button>
                ))}
              </div>

              {/* GRID DE PROYECTOS PAGINADOS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentProjects.length > 0 ? (
                  currentProjects.map((project) => {
                    const dateObj = new Date(project.updatedAt);
                    const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
                    // Añadimos un timestamp para que la URL sea "única" y fuerce la descarga
                    // En lugar de la URL de opengraph, apunta al archivo raw de tu repo
                    // 1. Definimos la ruta de tu imagen real dentro de tu repo (ajusta la carpeta si es necesario)
                    const customImageUrl = `https://raw.githubusercontent.com/${project.owner}/${project.name}/main/assets/preview.png`;
                    
                    // 2. Definimos la de respaldo (OpenGraph)
                    const backupImageUrl = `https://opengraph.githubassets.com/1/${project.owner}/${project.name}`;

                    return (
                      <div key={project.id} className="group border border-white/10 bg-[#111] flex flex-col hover:border-bit-cyan transition-colors duration-300 relative overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                        
                        <div className="h-48 relative overflow-hidden bg-black border-b border-white/5">
                          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] z-10 pointer-events-none"></div>
                          <img 
                            src={customImageUrl} 
                            alt={project.name} 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                            // EL TRUCO: Si la imagen personalizada no existe o falla, carga la de GitHub
                            onError={(e) => { 
                              if (e.target.src !== backupImageUrl) {
                                e.target.src = backupImageUrl;
                              } else {
                                // Si la de respaldo también falla, ponemos una de relleno (placeholder)
                                e.target.src = "https://images.unsplash.com/photo-1518770660439?auto=format&fit=crop&q=80&w=600";
                              }
                            }}
                          />
                          <div className="absolute top-3 right-3 z-20 border border-bit-cyan bg-background-dark/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold font-bit tracking-widest uppercase text-bit-cyan flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">update</span> 
                            {formattedDate}
                          </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-xl font-vatio text-bit-cyan truncate pr-2 tracking-wide mb-3">{project.name}</h3>
                          <p className="text-gray-400 text-xs font-bit line-clamp-3 mb-6 flex-1 leading-relaxed">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-8">
                            {project.tags?.map((tag, i) => (
                              <span key={i} className="border border-bit-cyan/30 text-bit-cyan text-[9px] px-2 py-1 font-bit uppercase bg-bit-cyan/5 tracking-wider">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-between items-center text-gray-600 font-bit text-xs mt-auto pt-4 border-t border-white/10">
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-vatio-yellow hover:text-white transition-colors font-bold tracking-widest group/btn ml-auto">
                              CODE LAUNCH <span className="material-symbols-outlined text-[14px] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform">call_made</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-gray-500 font-bit py-12">
                    NO SE ENCONTRARON SISTEMAS EN ESTA CATEGORÍA.
                  </div>
                )}
              </div>

              {/* CONTROLES DE PAGINACIÓN */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-16 font-bit text-xs tracking-widest">
                  <button 
                    onClick={() => {
                        setCurrentPage(prev => Math.max(prev - 1, 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 border border-white/20 text-gray-400 px-4 py-2 hover:border-bit-cyan hover:text-bit-cyan transition-colors disabled:opacity-30 disabled:hover:border-white/20 disabled:hover:text-gray-400"
                  >
                    <span className="material-symbols-outlined text-[14px]">chevron_left</span> PREV
                  </button>
                  
                  <span className="text-bit-cyan border border-bit-cyan/30 bg-bit-cyan/5 px-4 py-2">
                    PAGE {currentPage} / {totalPages}
                  </span>

                  <button 
                    onClick={() => {
                        setCurrentPage(prev => Math.min(prev + 1, totalPages));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 border border-white/20 text-gray-400 px-4 py-2 hover:border-bit-cyan hover:text-bit-cyan transition-colors disabled:opacity-30 disabled:hover:border-white/20 disabled:hover:text-gray-400"
                  >
                    NEXT <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'videos':
        const filteredVideos = videos.filter(video => 
          video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const featuredVideo = filteredVideos[0]; 
        const remainingVideos = filteredVideos.slice(1);

        // Paginación para el grid inferior
        const vPerPage = 6;
        const lastIdx = currentPage * vPerPage;
        const firstIdx = lastIdx - vPerPage;
        const currentGridVideos = remainingVideos.slice(firstIdx, lastIdx);
        const totalVPages = Math.ceil(remainingVideos.length / vPerPage);

        // 1. Filtramos los videos según lo que el usuario escribe
        return (
          <div className="pt-32 pb-24 relative neo-grid bg-[#0a0a0a] min-h-screen animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              
              {/* CABECERA Y BUSCADOR (Top del boceto) */}
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div className="text-left">
                  <button 
                    onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0 }); }}
                    className="flex items-center gap-2 text-gray-500 font-bit text-[10px] mb-4 hover:text-vatio-yellow transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span> REGRESAR
                  </button>
                  <h2 className="text-5xl font-vatio italic text-white leading-none">
                    GALERIA <span className="text-vatio-yellow">DE VIDEOS</span>
                  </h2>
                </div>
                
                {/* Barra de búsqueda sutil */}
                <div className="w-full md:w-72 relative">
                  <input 
                    type="text" 
                    placeholder="BUSCAR VIDEOS..." 
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reinicia a la pág 1 al buscar
                    }}
                    className="w-full bg-white/5 border border-white/10 py-2 px-4 font-bit text-[10px] text-white focus:border-vatio-yellow outline-none transition-all"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-2 text-gray-500 text-sm">search</span>
                </div>
              </div>

              {/* VIDEO DESTACADO (La pieza central de tu boceto) */}
              {featuredVideo && (
                <div className="relative group mb-20 border border-white/10 bg-[#111] overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    {/* Miniatura Grande */}
                    <div className="lg:w-2/3 relative aspect-video overflow-hidden">
                      <img 
                        src={featuredVideo.thumbnail} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <a href={featuredVideo.url} target="_blank" rel="noopener noreferrer" className="w-20 h-20 bg-vatio-yellow flex items-center justify-center rounded-full hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-black text-5xl">play_arrow</span>
                        </a>
                      </div>
                    </div>
                    {/* Info Destacada */}
                    <div className="lg:w-1/3 p-8 flex flex-col justify-center">
                      <span className="text-vatio-yellow font-bit text-[10px] tracking-[0.3em] mb-4 block">NEW RELEASE</span>
                      <h3 className="text-3xl font-vatio text-white mb-4 uppercase leading-tight">{featuredVideo.title}</h3>
                      <p className="text-gray-400 font-bit text-xs leading-relaxed mb-8">{featuredVideo.description}</p>
                      <div className="flex gap-4">
                        <span className="border border-white/20 px-3 py-1 text-[9px] font-bit text-gray-500">{featuredVideo.duration}</span>
                        <span className="border border-white/20 px-3 py-1 text-[9px] font-bit text-gray-500">{featuredVideo.category}</span>
                      </div>
                    </div>
                  </div>
                  {/* Detalles decorativos "System" */}
                  <div className="absolute top-0 right-0 p-2 opacity-20 font-bit text-[8px] text-white vertical-text">DECODING_VIDEO_STREAM...</div>
                </div>
              )}

              {/* GRID INFERIOR (Resto de videos) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {currentGridVideos.map((video) => (
                  <div key={video.id} className="group border border-white/5 bg-[#0f0f0f] hover:border-vatio-yellow transition-all duration-500">
                    <div className="relative aspect-video overflow-hidden">
                      <img src={video.thumbnail} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      <div className="absolute bottom-0 left-0 bg-vatio-yellow text-black font-bit text-[9px] px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        PLAY NOW
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="text-white font-vatio text-sm mb-2 truncate uppercase">{video.title}</h4>
                      <p className="text-gray-500 font-bit text-[10px] line-clamp-2 leading-relaxed">{video.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginación similar a la de Proyectos */}
              {totalVPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12 font-bit text-[10px]">
                  <button onClick={() => setCurrentPage(p => Math.max(p-1, 1))} disabled={currentPage === 1} className="px-4 py-2 border border-white/10 text-gray-500 hover:border-vatio-yellow disabled:opacity-10">PREV</button>
                  <span className="text-vatio-yellow">0{currentPage} / 0{totalVPages}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(p+1, totalVPages))} disabled={currentPage === totalVPages} className="px-4 py-2 border border-white/10 text-gray-500 hover:border-vatio-yellow disabled:opacity-10">NEXT</button>
                </div>
              )}

            </div>
          </div>
        );

      case 'publications':
        return (
          <div className="pt-32 min-h-screen flex items-center justify-center text-bit-cyan font-bit text-2xl animate-pulse">
            ::: COMMING SOON :::
          </div>
        );

      default:
        return <div>CARGANDO SISTEMA...</div>;
    }
  };



  return (
    <div className="min-h-screen bg-background-dark text-text-secondary font-bit selection:bg-bit-cyan selection:text-black overflow-x-hidden">
      
      {/* ================= HEADER / NAVBAR ================= */}
      <nav className="fixed top-0 w-full z-50 bg-background-dark/90 backdrop-blur-md border-b border-white/5 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
          
          {/* Logo Izquierda - Actúa como botón de "Inicio" */}
          <div className="flex items-center justify-center align-center">
            <button 
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity focus:outline-none"
            >
              {/* Ajusté las clases de la imagen para que se vea perfectamente dentro del contenedor */}
              <img src={logoCircular} alt="Bit y Vatio" className="w-full h-full object-contain" />
            </button>

            <a onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} className='cursor-pointer'>
              <span className="text-2xl lg:text-4xl font-black italic tracking-tighter leading-[0.5] ms-3 glitch-text transition-all duration-300">BIT<span className="text-bit-cyan">&</span><span className="text-vatio-yellow">VATIO</span></span>
            </a>
          </div>

          {/* Links y Botón Derecha */}
          <div className="hidden md:flex items-center gap-10">
            
            {/* Botón Videos */}
            <button 
              onClick={() => {
                setCurrentView('videos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className={`relative text-sm font-bold uppercase tracking-widest font-bit group pb-1 transition-colors ${currentView === 'videos' ? 'text-bit-cyan' : 'text-gray-400 hover:text-bit-cyan'}`}
            >
              Videos
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-bit-cyan transition-all duration-300 ${currentView === 'videos' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>

            {/* Botón Projects - EL ACTIVADOR DEL ARCHIVE */}
            <button 
              onClick={() => {
                setCurrentView('archive');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className={`relative text-sm font-bold uppercase tracking-widest font-bit group pb-1 transition-colors ${currentView === 'archive' ? 'text-bit-cyan' : 'text-gray-400 hover:text-bit-cyan'}`}
            >
              Proyectos
              {/* La línea cian se queda fija si estamos en la vista de proyectos */}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-bit-cyan transition-all duration-300 ${currentView === 'archive' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>

            {/* Botón Publications */}
            <button 
              onClick={() => {
                setCurrentView('publications');
                setTimeout(() => document.getElementById('publications')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }} 
              className="relative text-sm font-bold text-gray-400 hover:text-bit-cyan transition-colors uppercase tracking-widest font-bit group pb-1"
            >
              Publications
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-bit-cyan transition-all duration-300 group-hover:w-full"></span>
            </button>
            
            {/* Botón Contact - Estilo brutalista/retro */}
            <a 
              href="#contact" 
              className="bg-vatio-yellow hover:bg-[#E6C200] text-black px-6 py-2 text-sm font-bold transition-all uppercase font-bit ml-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              Contact
            </a>
          </div>

          {/* Icono de menú para móviles */}
          <div className="md:hidden flex items-center">
            <button className="text-bit-cyan hover:text-white transition-colors">
              <span className="material-symbols-outlined text-3xl">menu</span>
            </button>
          </div>

        </div>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-bit-cyan via-vatio-yellow to-bit-cyan"></div>
      </nav>

      {renderView()}

      {/* ================= FOOTER ================= */}
      <footer className="bg-background-dark py-12 relative overflow-hidden mt-12">
        {/* Línea de gradiente superior que cruza toda la pantalla */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bit-cyan via-vatio-yellow to-bit-cyan"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            
            {/* Izquierda: Logo y Copyright */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                {/* Botón Home / Volver arriba */}
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-8 h-8 bg-white/10 flex items-center justify-center text-gray-400 hover:text-bit-cyan hover:border-bit-cyan hover:bg-bit-cyan/10 transition-all cursor-pointer border border-white/5 group"
                  title="Volver al inicio"
                >
                  <span className="material-symbols-outlined text-base group-hover:-translate-y-0.5 transition-transform">home</span>
                </button>
              </div>
              <p className="text-gray-500 text-xs font-bit">
                © 2026 Bit & Vatio. Systems.
              </p>
            </div>

            {/* Derecha: Botones de Redes Sociales / Enlaces */}
            <div className="flex gap-4">
              <a onClick={() => {
                setCurrentView('videos');
                setCurrentPage(1); // Resetear a pág 1
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} className="w-10 h-10 flex items-center justify-center border border-white/10 hover:border-vatio-yellow hover:text-vatio-yellow text-gray-400 transition-all bg-white/5 group cursor-pointer">
              
                <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">video_library</span>
              </a>
              <a onClick={() => {
                        setCurrentView('archive');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }} className="w-10 h-10 flex items-center justify-center border border-white/10 hover:border-bit-cyan hover:text-bit-cyan text-gray-400 transition-all bg-white/5 group cursor-pointer">
                <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">code_blocks</span>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-white/10 hover:border-vatio-yellow hover:text-vatio-yellow text-gray-400 transition-all bg-white/5 group">
                <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">alternate_email</span>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-white/10 hover:border-bit-cyan hover:text-bit-cyan text-gray-400 transition-all bg-white/5 group">
                <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">person_pin</span>
              </a>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;