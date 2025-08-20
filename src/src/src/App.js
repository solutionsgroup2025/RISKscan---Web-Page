import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  LineChart,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Server,
  Cpu,
  Cloud,
  PlayCircle,
  Users,
  Settings2,
  Search,
  BarChart2,
  Presentation,
  FileText,
  Wrench,
  Sparkles,
  ServerCrash,
  TrendingDown,
  ShieldOff,
  Download,
  MessageSquare,
  Send,
  X,
  Calendar,
  Globe,
  ChevronDown
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell
} from "recharts";

const sectoresData = [
  { sector: "Financiero", incidentes: 100 },
  { sector: "Legal", incidentes: 72 },
  { sector: "Salud", incidentes: 81 },
  { sector: "Manufactura", incidentes: 65 },
];

const barColors = ["#fb923c", "#facc15", "#a3e635", "#4ade80"];

const regiones = [
  { key: "na-eu", titulo: "Norteamérica & Europa", texto: "Concentran >70% de los incidentes reportados. Los atacantes explotan configuraciones erróneas y vulnerabilidades sin parchear para obtener acceso inicial." },
  { key: "latam", titulo: "América Latina", texto: "Crecimiento acelerado de ataques dirigidos, especialmente en los sectores financiero y gubernamental." },
  { key: "apac", titulo: "Asia–Pacífico", texto: "Aumento de operaciones de estados–nación y crimen organizado enfocadas en PI e infraestructura crítica." },
];

const requisitos = [
  { titulo: "Active Directory On‑Premise", contenido: "Cuenta de servicio con permisos de solo lectura en el dominio (sin privilegios de admin) y conectividad desde el colector a los Controladores de Dominio.", icon: <Server className="w-5 h-5" /> },
  { titulo: "Colector de Datos (Sonda Virtual)", contenido: "OVA para su hipervisor (VMware/Hyper‑V). Requisitos mínimos: 4 vCPU, 16 GB RAM, 100 GB disco.", icon: <Cpu className="w-5 h-5" /> },
  { titulo: "Microsoft Entra ID (Azure AD)", contenido: "Consentimiento de una Enterprise App con permisos de solo lectura (p.ej. Directory.Read.All). Sin permisos de escritura.", icon: <Cloud className="w-5 h-5" /> },
];

const pasos = [
  { n: 1, t: "Reunión de Alcance", icon: <Users/>, d: "Definimos juntos los objetivos y el alcance de la evaluación." },
  { n: 2, t: "Configuración", icon: <Settings2/>, d: "Desplegamos la sonda virtual y configuramos el acceso de solo lectura." },
  { n: 3, t: "Ejecución", icon: <Search/>, d: "La plataforma simula miles de vectores de ataque de forma segura y automatizada." },
  { n: 4, t: "Análisis", icon: <BarChart2/>, d: "Correlacionamos hallazgos para identificar las cadenas de ataque de mayor riesgo." },
  { n: 5, t: "Presentación", icon: <Presentation/>, d: "Entregamos los resultados clave en una sesión ejecutiva enfocada en el impacto de negocio." },
  { n: 6, t: "Informes", icon: <FileText/>, d: "Proveemos reportes técnicos detallados y un plan de remediación accionable." },
  { n: 7, t: "Remediación", icon: <Wrench/>, d: "Acompañamos a su equipo para asegurar la correcta implementación de los controles." },
];

const knowledgeBase = `
Información sobre RISKscan:
- Servicio de evaluación de riesgos para Microsoft Entra ID y Active Directory On-Premise.
- Dirigido a CISOs y líderes de seguridad.
- Simula miles de vectores de ataque para descubrir rutas de explotación.
- A diferencia del pentesting tradicional, mapea todas las rutas posibles, no solo una. Es continuo, no puntual.
- Proporciona visibilidad completa, priorización inteligente y ayuda a reducir la superficie de ataque.
- El impacto de un ataque a AD es devastador: paralización del negocio, pérdidas financieras y daño reputacional.
- El flujo del servicio incluye: Alcance, Configuración, Ejecución, Análisis, Presentación, Informes y Remediación.
- Requisitos: Cuenta de solo lectura para AD, un colector virtual (OVA) y consentimiento para una App de solo lectura en Entra ID.
- El objetivo final es ayudar al cliente a fortalecer su seguridad. Se debe guiar al cliente para que agende una cita con ventas para obtener más detalles.
`;

const Section = ({ id, className = "", children }) => (
  <section id={id} className={`py-16 md:py-24 ${className}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
  </section>
);

const SectionHeader = ({ subtitle, title, children }) => (
    <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-lg font-semibold text-blue-500">{subtitle}</span>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{title}</h2>
        {children && <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{children}</p>}
    </div>
);

const Card = ({ children, className="" }) => (
  <div className={`rounded-2xl border border-slate-200 dark:border-neutral-800 p-6 shadow-sm bg-white/70 backdrop-blur dark:bg-neutral-900/70 ${className}`}>{children}</div>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-black text-white dark:bg-white dark:text-black px-3 py-1 text-xs">
    {children}
  </span>
);

const AcordeonItem = ({ item, isOpen, onClick }) => (
    <div className="border-b border-slate-200 dark:border-neutral-800">
        <button onClick={onClick} className="w-full flex justify-between items-center text-left py-4">
            <span className="flex items-center gap-3 font-medium">
                {item.icon}
                {item.titulo}
            </span>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                <ChevronDown className="w-5 h-5" />
            </motion.div>
        </button>
        <motion.div
            initial={false}
            animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0, marginTop: isOpen ? '0.5rem' : '0rem', marginBottom: isOpen ? '1rem' : '0rem' }}
            className="overflow-hidden text-slate-600 dark:text-slate-300"
        >
            <p className="px-2">{item.contenido}</p>
        </motion.div>
    </div>
);

const CustomBar = (props) => {
    const { x, y, width, height, fill } = props;
    const topWidth = 10;
    const color = fill;
    const darkerColor = color.replace(')', ', 0.7)').replace('rgb', 'rgba');
    const sideColor = color.replace(')', ', 0.85)').replace('rgb', 'rgba');
    return (
        <g>
            <rect x={x} y={y} width={width} height={height} fill={color} />
            <path d={`M${x},${y} L${x + topWidth},${y - topWidth} L${x + width + topWidth},${y - topWidth} L${x + width},${y} Z`} fill={darkerColor} />
            <path d={`M${x + width},${y} L${x + width + topWidth},${y - topWidth} L${x + width + topWidth},${y + height - topWidth} L${x + width},${y + height} Z`} fill={sideColor} />
        </g>
    );
};

const ImpactInfographic = ({ data }) => {
    const getSeverityConfig = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'crítica': return { color: 'red', Icon: AlertTriangle };
            case 'alta': return { color: 'orange', Icon: TrendingDown };
            case 'media': return { color: 'yellow', Icon: ShieldOff };
            default: return { color: 'gray', Icon: ShieldCheck };
        }
    };
    const impactCards = [
        { ...data.operativo, type: 'Operativo', Icon: ServerCrash },
        { ...data.financiero, type: 'Financiero', Icon: TrendingDown },
        { ...data.reputacional, type: 'Reputacional', Icon: ShieldOff }
    ];
    return (
        <motion.div
            className="mt-8 grid md:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.2 }}
        >
            {impactCards.map((card, index) => {
                const { color } = getSeverityConfig(card.severidad);
                const colors = {
                    red: { border: 'border-red-500', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-800 dark:text-red-300', icon: 'text-red-500' },
                    orange: { border: 'border-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-800 dark:text-orange-300', icon: 'text-orange-500' },
                    yellow: { border: 'border-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-800 dark:text-yellow-300', icon: 'text-yellow-500' },
                    gray: { border: 'border-gray-500', bg: 'bg-gray-50 dark:bg-gray-900/20', text: 'text-gray-800 dark:text-gray-300', icon: 'text-gray-500' },
                };
                const theme = colors[color] || colors.gray;
                return (
                    <motion.div
                        key={index}
                        className={`p-4 border-l-4 ${theme.border} ${theme.bg} rounded-r-lg`}
                        variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.2 }}
                    >
                        <div className="flex items-center gap-3">
                            <card.Icon className={`w-8 h-8 ${theme.icon}`} />
                            <h3 className={`text-lg font-bold ${theme.text}`}>{card.titulo}</h3>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-slate-800 dark:text-white">{card.metrica}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{card.descripcion}</p>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [userName, setUserName] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const messagesEndRef = useRef(null);
    const assistantAvatar = "https://i.imgur.com/izx17lM.jpeg";

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ sender: 'ai', text: '¡Hola! Soy Solut.ia, tu asistente virtual. Estoy aquí para ayudarte con cualquier pregunta que tengas sobre RISKscan. Para empezar, ¿cuál es tu nombre?' }]);
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);
    
    const capitalize = (s) => {
        if (typeof s !== 'string' || !s) return s;
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        if (!userName) {
            const formattedName = capitalize(input);
            setUserName(formattedName);
            setTimeout(() => {
                setMessages(prev => [...prev, { sender: 'ai', text: `¡Hola, ${formattedName}! Un placer conocerte. ¿En qué puedo ayudarte hoy sobre RISKscan?` }]);
                setIsTyping(false);
            }, 1000);
            return;
        }

        const currentQuestionCount = questionCount + 1;
        setQuestionCount(currentQuestionCount);
        const historyForPrompt = messages.map(msg => `${msg.sender === 'user' ? userName || 'Cliente' : 'Solut.ia'}: ${msg.text}`).join('\n');
        const prompt = `
            Eres Solut.ia, un asistente de IA amigable y profesional de Solutions Group. Tu propósito es responder preguntas sobre el servicio RISKscan y guiar a los clientes a agendar una reunión.
            Base de Conocimiento Interna:
            ---
            ${knowledgeBase}
            ---
            Reglas Estrictas de Conversación:
            1.  **Identidad:** Eres Solut.ia. Sé amable y usa el nombre del cliente (${userName}).
            2.  **Enfoque:** Habla únicamente sobre RISKscan y temas relacionados. Si te preguntan otra cosa, redirige la conversación amablemente.
            3.  **Conocimiento:** Basa tus respuestas en la Base de Conocimiento. Si la información no está allí, usa tu conocimiento general pero NUNCA reveles tus fuentes.
            4.  **Brevedad:** Sé conciso. Responde en 2-3 frases cortas.
            5.  **Regla de Precios:** Si el cliente pregunta por el precio, responde EXACTAMENTE: "Esa es una excelente pregunta. La información detallada sobre la inversión la maneja directamente un consultor de negocios para adaptarla a tus necesidades." y LUEGO inserta el placeholder [BOOKING_LINK].
            6.  **Flujo de Venta (Contexto: El usuario ya ha hecho ${currentQuestionCount} preguntas):**
                -   Si ${currentQuestionCount} >= 2, después de responder la pregunta actual, DEBES preguntar: "¿He aclarado tu duda o tienes alguna otra consulta?".
                -   Si la pregunta del usuario es una respuesta negativa a lo anterior (ej. "no, gracias", "eso es todo"), responde: "¡Perfecto! ¿Te gustaría agendar una reunión sin costo con un consultor para profundizar en cómo RISKscan puede ayudar a tu organización?". Luego, inserta el placeholder [BOOKING_LINK].
                -   Si la pregunta del usuario es compleja o muestra mucho interés, responde brevemente y luego ofrece proactivamente la reunión insertando el placeholder [BOOKING_LINK].
            
            Historial de la Conversación:
            ${historyForPrompt}
            
            Nueva Pregunta del Cliente: "${input}"
            ---
            Tu respuesta:
        `;
        let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error("Network response was not ok.");
            const result = await response.json();
            const aiResponse = result.candidates[0].content.parts[0].text;
            setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setMessages(prev => [...prev, { sender: 'ai', text: "Lo siento, estoy teniendo problemas para conectarme en este momento. Por favor, intenta de nuevo más tarde." }]);
        } finally {
            setIsTyping(false);
        }
    };

    const renderMessage = (msg) => {
        if (msg.sender === 'ai' && msg.text.includes('[BOOKING_LINK]')) {
            const parts = msg.text.split('[BOOKING_LINK]');
            return (
                <div className="flex flex-col gap-2">
                    <span>{parts[0]}</span>
                    <a 
                        href="https://outlook.office.com/bookwithme/user/fd9524fcd26640c487ad1d7c67af9d18%40solutionspanama.com/meetingtype/QDvzcMjSuEe8-YOe90eLrg2?anonymous&ismsaljsauthenabled" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg inline-flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors text-sm"
                    >
                        <Calendar className="w-4 h-4" />
                        Agendar Reunión
                    </a>
                    <span>{parts[1]}</span>
                </div>
            );
        }
        return msg.text;
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-24 right-4 w-80 md:w-96 h-[500px] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-200 dark:border-neutral-800"
                    >
                        <div className="p-4 border-b dark:border-neutral-800 flex items-center gap-3 bg-slate-50 dark:bg-neutral-800/50 rounded-t-2xl">
                            <img src={assistantAvatar} alt="Solut.ia" className="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <h3 className="font-bold">Solut.ia Asistente</h3>
                                <p className="text-xs text-green-500">● En línea</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-neutral-700 ml-auto">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-grow p-4 overflow-y-auto">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`rounded-lg px-3 py-2 max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-neutral-800 text-slate-800 dark:text-slate-200'}`}>
                                        {renderMessage(msg)}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="rounded-lg px-3 py-2 bg-slate-200 dark:bg-neutral-800 text-slate-800 dark:text-slate-200">
                                        <div className="flex items-center gap-1">
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-0"></span>
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-neutral-800 flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={userName ? "Haz una pregunta..." : "Escribe tu nombre..."}
                                className="w-full p-2 border border-slate-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                            />
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 bg-blue-500 w-20 h-20 rounded-full shadow-lg hover:bg-blue-600 transition-all transform hover:scale-110 z-50 border-4 border-white dark:border-neutral-800 overflow-hidden"
            >
                <img src={assistantAvatar} alt="Abrir chat con Solut.ia" className="w-full h-full object-cover" />
            </button>
        </>
    );
};

const Loader = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default function RiskscanLanding() {
  const [regionActiva, setRegionActiva] = useState(regiones[0].key);
  const [acordeonAbierto, setAcordeonAbierto] = useState(0);
  
  const [companyDescription, setCompanyDescription] = useState({
      users: '1-100',
      branches: '1',
      platform: 'Híbrido'
  });
  const [impactScenario, setImpactScenario] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const regionTexto = useMemo(
    () => regiones.find((r) => r.key === regionActiva)?.texto ?? regiones[0].texto,
    [regionActiva]
  );
  
  const handleDescriptionChange = (e) => {
      const { name, value } = e.target;
      setCompanyDescription(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateImpact = async () => {
    setIsLoading(true);
    setError(null);
    setImpactScenario(null);

    const fullDescription = `Una empresa con ${companyDescription.users} usuarios, ${companyDescription.branches} sucursales, y una plataforma ${companyDescription.platform}.`;

    const prompt = `Actúa como un consultor de ciberseguridad experto en Active Directory. Analiza la siguiente descripción de empresa: "${fullDescription}".
    Genera una respuesta JSON estructurada que resuma el impacto de negocio de un ataque exitoso a su Directorio Activo.
    El JSON debe tener tres claves principales: "operativo", "financiero", y "reputacional".
    Cada clave debe ser un objeto con los siguientes campos:
    - "titulo": Un título corto y llamativo (ej. "Parálisis Operativa").
    - "metrica": Una métrica de impacto cuantificable y alarmante (ej. "48-72 horas de inactividad", ">$1M en costos", "Pérdida del 20% de clientes").
    - "descripcion": Una explicación concisa (máximo 20 palabras).
    - "severidad": Clasifica la severidad como "Crítica", "Alta", o "Media".
    La respuesta debe ser únicamente el objeto JSON.`;

    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    
    const schema = {
      type: "OBJECT",
      properties: {
        operativo: { type: "OBJECT", properties: { titulo: { type: "STRING" }, metrica: { type: "STRING" }, descripcion: { type: "STRING" }, severidad: { type: "STRING" } } },
        financiero: { type: "OBJECT", properties: { titulo: { type: "STRING" }, metrica: { type: "STRING" }, descripcion: { type: "STRING" }, severidad: { type: "STRING" } } },
        reputacional: { type: "OBJECT", properties: { titulo: { type: "STRING" }, metrica: { type: "STRING" }, descripcion: { type: "STRING" }, severidad: { type: "STRING" } } }
      }
    };

    const payload = { 
        contents: chatHistory,
        generationConfig: { responseMimeType: "application/json", responseSchema: schema }
    };
    
    const apiKey = ""; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();
        
        if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
            const jsonText = result.candidates[0].content.parts[0].text;
            const parsedJson = JSON.parse(jsonText);
            setImpactScenario(parsedJson);
        } else {
            throw new Error("Respuesta inesperada o vacía de la API.");
        }

    } catch (e) {
        console.error(e);
        setError("No se pudo generar el escenario. Por favor, inténtalo de nuevo más tarde.");
    } finally {
        setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-black dark:to-neutral-900 text-slate-900 dark:text-slate-100 font-sans">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/60 dark:bg-black/40 border-b border-slate-200 dark:border-neutral-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
            <span className="font-semibold">RISKscan</span>
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-300">
            <a href="#panorama" className="hover:text-blue-500 transition-colors">Panorama</a>
            <a href="#impacto" className="hover:text-blue-500 transition-colors">Impacto</a>
            <a href="#simulador" className="hover:text-blue-500 transition-colors">Simulador de Riesgo</a>
            <a href="#riskscan" className="hover:text-blue-500 transition-colors">RISKscan</a>
            <a href="#flujo" className="hover:text-blue-500 transition-colors">Flujo</a>
            <a href="#requisitos" className="hover:text-blue-500 transition-colors">Requisitos</a>
          </div>
          <a href="https://www.solutionspanama.com/riskscan-ad/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium border border-slate-300 dark:border-neutral-700 rounded-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors">
            Descargar Guía <Download className="w-4 h-4" />
          </a>
        </nav>
      </header>

      <main>
        <Section>
          <div className="grid lg:grid-cols-2 items-center gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Pill>
                <span className="font-semibold">Evaluación Avanzada de Riesgos</span>
                <span className="opacity-70">Entra ID • Active Directory</span>
              </Pill>
              <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight text-slate-900 dark:text-white">
                Identifique amenazas, vulnerabilidades y rutas de ataques en Microsoft Entra ID y Active Directory
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Dirigido a CISOs y líderes de seguridad. Simulamos miles de vectores de ataque para descubrir las rutas que los adversarios explotan, permitiéndole remediar lo que realmente importa.
              </p>
              <div className="mt-8 flex gap-4">
                <a href="https://www.solutionspanama.com/riskscan-ad/" target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
                    Descarga Guía <Download className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
            <motion.div 
                className="relative h-80 lg:h-full rounded-2xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <img src="https://i.imgur.com/RpcAZ64.png" alt="Profesional de ciberseguridad analizando datos" className="w-full h-full object-contain"/>
            </motion.div>
          </div>
        </Section>

        <Section id="panorama" className="bg-slate-100 dark:bg-neutral-900">
            <SectionHeader subtitle="Panorama Global" title="El Directorio Activo es el Objetivo #1">
                Los atacantes no buscan vulnerabilidades, buscan caminos. El Directorio Activo es el mapa que los guía hacia sus activos más críticos.
            </SectionHeader>
            <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-2"><Globe className="w-6 h-6 text-blue-500" /> Focos de Ataque Globales</h3>
                    <div className="space-y-2">
                        {regiones.map(r => (
                            <button key={r.key} onClick={() => setRegionActiva(r.key)} className={`w-full text-left p-4 rounded-lg border-2 transition-all ${regionActiva === r.key ? 'bg-white dark:bg-neutral-800 border-blue-500 shadow-md' : 'border-transparent hover:bg-white/50 dark:hover:bg-neutral-800/50'}`}>
                                {r.titulo}
                            </button>
                        ))}
                    </div>
                    <p className="mt-4 p-4 bg-white dark:bg-neutral-800 rounded-lg text-slate-600 dark:text-slate-300 h-32">{regionTexto}</p>
                </div>
                <div className="lg:col-span-3">
                    <h3 className="font-bold text-lg mb-4">Sectores Más Afectados</h3>
                    <Card className="h-96 w-full pt-10">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sectoresData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                                <XAxis dataKey="sector" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: 'white', border: '1px solid #ccc'}} />
                                <Bar dataKey="incidentes" shape={<CustomBar />}>
                                    {sectoresData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-2">Fuente: Análisis de Incidentes de Ciberseguridad 2024</p>
                    </Card>
                </div>
            </div>
        </Section>

        <Section id="impacto">
            <SectionHeader subtitle="Las Consecuencias" title="Un Ataque Exitoso es Devastador" />
            <div className="grid md:grid-cols-3 gap-8">
                <Card>
                    <AlertTriangle className="w-10 h-10 text-red-500 mb-4" />
                    <h3 className="font-bold text-xl">Paralización del Negocio</h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">Bloqueo total de acceso a sistemas, interrupción de la producción y cese de operaciones comerciales.</p>
                </Card>
                <Card>
                    <LineChart className="w-10 h-10 text-yellow-500 mb-4" />
                    <h3 className="font-bold text-xl">Pérdida Financiera Masiva</h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">Costos de remediación, pago de rescates, multas regulatorias y pérdida de ingresos por inactividad.</p>
                </Card>
                <Card>
                    <ShieldCheck className="w-10 h-10 text-green-500 mb-4" />
                    <h3 className="font-bold text-xl">Daño Reputacional</h3>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">Pérdida de confianza de clientes, socios e inversionistas que puede tardar años en recuperarse.</p>
                </Card>
            </div>
        </Section>
        
        <Section id="simulador" className="bg-slate-100 dark:bg-neutral-900">
            <SectionHeader subtitle="Simulador de Riesgo en Active Directory" title="Visualice el Riesgo en su Propia Empresa">
                ¿No está seguro de cómo le afectaría un ataque? Defina el perfil de su organización y nuestra IA, potenciada por Gemini, generará un escenario de impacto personalizado.
            </SectionHeader>
            <div className="max-w-4xl mx-auto">
                <Card>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Cantidad de Usuarios</label>
                            <select name="users" value={companyDescription.users} onChange={handleDescriptionChange} className="w-full p-2 border border-slate-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition">
                                <option>1-100</option>
                                <option>101-500</option>
                                <option>501-1000</option>
                                <option>1000+</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Sucursales</label>
                            <select name="branches" value={companyDescription.branches} onChange={handleDescriptionChange} className="w-full p-2 border border-slate-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition">
                                <option>1</option>
                                <option>2-5</option>
                                <option>6-10</option>
                                <option>10+</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Plataforma</label>
                            <select name="platform" value={companyDescription.platform} onChange={handleDescriptionChange} className="w-full p-2 border border-slate-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition">
                                <option>Híbrido</option>
                                <option>Entra ID</option>
                                <option>Active Directory On-Premise</option>
                            </select>
                        </div>
                    </div>
                    <button 
                        onClick={handleGenerateImpact}
                        disabled={isLoading}
                        className="w-full bg-blue-500 text-white font-semibold px-6 py-3 rounded-full inline-flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? ( <><Loader />Generando...</> ) : ( <><Sparkles className="w-5 h-5" />Generar Escenario de Impacto</> )}
                    </button>
                    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                    {impactScenario && <ImpactInfographic data={impactScenario} />}
                </Card>
            </div>
        </Section>

        <Section id="riskscan">
            <SectionHeader subtitle="La Solución" title="RISKscan: De la Incertidumbre a la Acción">
                A diferencia de un pentesting tradicional, RISKscan no se detiene en la primera vulnerabilidad; mapea todas las rutas de ataque posibles que un adversario podría explotar.
            </SectionHeader>
             <div className="mt-12 max-w-4xl mx-auto bg-white dark:bg-neutral-800 rounded-2xl border border-slate-200 dark:border-neutral-700 shadow-lg p-8 space-y-6">
                    <div className="grid grid-cols-3 items-center gap-4 pb-4 border-b border-slate-200 dark:border-neutral-700">
                        <h4 className="text-lg font-bold text-slate-800 dark:text-white col-span-1">Característica</h4>
                        <h4 className="text-md font-bold text-slate-500 dark:text-slate-400 text-center">Pentesting Tradicional</h4>
                        <h4 className="text-md font-bold text-blue-500 text-center">RISKscan</h4>
                    </div>
                    {[
                        { feature: 'Enfoque', traditional: 'Encontrar una ruta', riskscan: 'Mapear TODAS las rutas' },
                        { feature: 'Frecuencia', traditional: 'Puntual (Foto estática)', riskscan: 'Continuo (Video dinámico)' },
                        { feature: 'Resultados', traditional: 'Lista de vulnerabilidades', riskscan: 'Cadenas de ataque priorizadas' }
                    ].map(item => (
                         <div key={item.feature} className="grid grid-cols-3 items-center gap-4 pt-4 border-t border-slate-200 dark:border-neutral-700 first:border-t-0">
                            <span className="font-semibold text-slate-700 dark:text-slate-200">{item.feature}</span>
                            <div className="flex justify-center items-center gap-2 text-slate-500"><XCircle className="w-6 h-6 text-red-400" /> {item.traditional}</div>
                            <div className="flex justify-center items-center gap-2 font-bold text-slate-800 dark:text-white"><CheckCircle2 className="w-6 h-6 text-green-500" /> {item.riskscan}</div>
                        </div>
                    ))}
                </div>
        </Section>

        <Section id="flujo" className="bg-slate-100 dark:bg-neutral-900">
            <SectionHeader subtitle="Nuestro Proceso" title="Un Flujo de Trabajo Claro y Eficiente" />
            <div className="max-w-3xl mx-auto">
                <div className="relative">
                    <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-neutral-700" aria-hidden="true"></div>
                    {pasos.map((paso, index) => (
                        <motion.div 
                            key={paso.n} 
                            className="relative flex items-start gap-6 mb-8"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xl z-10">
                                {paso.n}
                            </div>
                            <div className="pt-2">
                                <div className="flex items-center gap-3">
                                    <div className="text-slate-500 dark:text-slate-400">
                                        {React.cloneElement(paso.icon, { className: "w-6 h-6" })}
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">{paso.t}</h3>
                                </div>
                                <p className="mt-1 text-slate-600 dark:text-slate-300">{paso.d}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
        
        <Section id="requisitos">
            <SectionHeader subtitle="Preparación" title="Requisitos para la Evaluación" />
            <div className="max-w-2xl mx-auto">
                {requisitos.map((item, index) => (
                    <AcordeonItem 
                        key={index}
                        item={item}
                        isOpen={acordeonAbierto === index}
                        onClick={() => setAcordeonAbierto(acordeonAbierto === index ? -1 : index)}
                    />
                ))}
            </div>
        </Section>

        <Section id="demo" className="bg-slate-100 dark:bg-neutral-900">
            <div className="bg-blue-500 text-white rounded-2xl p-12 text-center shadow-2xl shadow-blue-500/40">
                <ShieldCheck className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold">Dé el Primer Paso Hacia una Defensa Proactiva</h2>
                <p className="mt-4 max-w-2xl mx-auto text-blue-100">
                    No espere a ser la próxima estadística. Agende una demostración gratuita y sin compromiso para ver en vivo cómo RISKscan puede revelar los riesgos ocultos en su Directorio Activo.
                </p>
                <a href="https://www.solutionspanama.com/riskscan-ad/" target="_blank" rel="noopener noreferrer" className="mt-8 bg-white text-blue-500 font-bold px-8 py-3 rounded-full inline-flex items-center gap-2 hover:bg-slate-100 transition-colors">
                    Descargar la Guía Ahora <Download className="w-5 h-5" />
                </a>
            </div>
        </Section>
      </main>

      <footer className="border-t border-slate-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>&copy; {new Date().getFullYear()} Solutions Group, S.A. Todos los derechos reservados.</p>
            <p className="mt-2">RISKscan es un servicio de evaluación de riesgos avanzado.</p>
        </div>
      </footer>
      
      <ChatAssistant />
    </div>
  );
}
