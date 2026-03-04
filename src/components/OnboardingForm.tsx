import React, { useState, useEffect, useRef, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Check,
    Loader2,
    ChevronDown,
    Upload,
    FileText,
    Video,
    Bot,
    User,
    ShieldAlert,
    Zap,
    X,
    FileIcon
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILITIES ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- MOCK SHADCN UI COMPONENTS (Customized for Palette) ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "default", size = "default", children, ...props }, ref) => {
    const variants = {
        default: "bg-[#4F46E5] text-white hover:bg-[#4F46E5]/90 shadow-[0_0_15px_-3px_rgba(79,70,229,0.4)] border border-transparent",
        outline: "border border-neutral-800 bg-[#0A0A0A] hover:bg-neutral-900 text-white",
        ghost: "hover:bg-neutral-800 text-white hover:text-[#00E3A5]",
    };
    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        icon: "h-10 w-10",
    };

    return (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-[#0A0A0A] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
});
Button.displayName = "Button";

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
    <input
        ref={ref}
        className={cn(
            "flex h-10 w-full rounded-md border border-neutral-800 bg-[#171717] px-3 py-2 text-sm text-white ring-offset-[#0A0A0A] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F46E5] focus-visible:border-[#4F46E5] disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            className
        )}
        {...props}
    />
));
Input.displayName = "Input";

const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-300",
            className
        )}
        {...props}
    />
));
Label.displayName = "Label";

const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
    <textarea
        ref={ref}
        className={cn(
            "flex min-h-[80px] w-full rounded-md border border-neutral-800 bg-[#171717] px-3 py-2 text-sm text-white ring-offset-[#0A0A0A] placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F46E5] focus-visible:border-[#4F46E5] disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            className
        )}
        {...props}
    />
));
Textarea.displayName = "Textarea";

// Simplified Card Components
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
);
const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);
const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
);
const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);
const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("p-6 pt-0 pb-32 md:pb-6", className)} {...props} />
);
const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
);

// Simplified Select Components
const Select = React.forwardRef<HTMLDivElement, { value?: string, onValueChange?: (value: string) => void, children: React.ReactNode }>(({ value, onValueChange, children }, ref) => {
    // Basic implementation for demo purposes - in real app use full Shadcn Select
    const [open, setOpen] = useState(false);

    // Provide context to children (simplified)
    return (
        <div className="relative">
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    // @ts-ignore
                    return React.cloneElement(child, { value, onValueChange, open, setOpen });
                }
                return child;
            })}
        </div>
    );
});
Select.displayName = "Select";

const SelectTrigger = React.forwardRef<HTMLButtonElement, any>(({ className, children, open, setOpen, value, ...props }, ref) => (
    <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-neutral-800 bg-[#171717] px-3 py-2 text-sm ring-offset-[#0A0A0A] placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#4F46E5] disabled:cursor-not-allowed disabled:opacity-50 text-white",
            className
        )}
        {...props}
    >
        {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                // @ts-ignore
                return React.cloneElement(child, { value });
            }
            return child;
        })}
        <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef<HTMLSpanElement, any>(({ placeholder, value }, ref) => (
    <span className="block truncate">{value ?
        (value === "person" ? "Pessoa Física" :
            value === "assistant" ? "Assistente" :
                value === "friendly" ? "Amigável e Casual" :
                    value === "formal" ? "Formal e Profissional" :
                        value === "technical" ? "Técnico e Especialista" :
                            value === "persuasive" ? "Persuasivo (Vendas)" :
                                value === "empathetic" ? "Empático e Atencioso" : value)
        : placeholder}</span>
));
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef<HTMLDivElement, any>(({ className, children, open, onValueChange, setOpen, ...props }, ref) => {
    if (!open) return null;
    return (
        <div className={cn(
            "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-neutral-800 bg-[#171717] text-popover-foreground shadow-md animate-in fade-in-80 w-full mt-1",
            className
        )} {...props}>
            <div className="p-1">
                {React.Children.map(children, child => {
                    if (React.isValidElement(child)) {
                        // @ts-ignore
                        return React.cloneElement(child as React.ReactElement<any>, {
                            onClick: (val: string) => {
                                onValueChange && onValueChange(val);
                                setOpen(false);
                            }
                        });
                    }
                    return child;
                })}
            </div>
        </div>
    );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<HTMLDivElement, any>(({ className, children, value, onClick, ...props }, ref) => (
    <div
        onClick={() => onClick(value)}
        className={cn(
            "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-neutral-800 hover:text-white cursor-pointer data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-neutral-300",
            className
        )}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            {/* Indicator would go here */}
        </span>
        <span className="truncate">{children}</span>
    </div>
));
SelectItem.displayName = "SelectItem";

// Simplified RadioGroup
const RadioGroup = React.forwardRef<HTMLDivElement, { value?: string, onValueChange?: (value: string) => void, className?: string, children: React.ReactNode }>(({ className, value, onValueChange, children, ...props }, ref) => {
    return (
        <div className={cn("grid gap-2", className)} {...props}>
            {React.Children.map(children, child => {
                // Clone children to inject checked state if needed, though we handle click on parent div usually
                return child;
            })}
        </div>
    );
});
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<HTMLButtonElement, { value: string, id: string, checked?: boolean, className?: string }>(({ className, value, id, checked, ...props }, ref) => {
    return (
        <div className={cn(
            "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-neutral-400",
            checked && "border-[#4F46E5]",
            className
        )}>
            <div className={cn("h-full w-full rounded-full bg-[#4F46E5]",
                !checked && "hidden"
            )} />
        </div>
    )
});
RadioGroupItem.displayName = "RadioGroupItem";


// --- MAIN COMPONENT ---

const steps = [
    { id: 'personal', title: 'Informações Pessoais', icon: <User className="w-5 h-5 md:w-6 md:h-6" />, description: 'Dados essenciais para a geração do contrato.' },
    { id: 'business', title: 'Perfil da Empresa', icon: <Bot className="w-5 h-5 md:w-6 md:h-6" />, description: 'Entendendo o seu negócio e público-alvo.' },
    { id: 'identity', title: 'Identidade da IA', icon: <User className="w-5 h-5 md:w-6 md:h-6" />, description: 'Personalidade e forma de comunicação do assistente.' },
    { id: 'rules', title: 'Regras', icon: <ShieldAlert className="w-5 h-5 md:w-6 md:h-6" />, description: 'Definindo limites e ações da Inteligência Artificial.' },
    { id: 'knowledge', title: 'Base', icon: <FileText className="w-5 h-5 md:w-6 md:h-6" />, description: 'Informações vitais sobre seus produtos e serviços.' },
    { id: 'finish', title: 'Finalização', icon: <Zap className="w-5 h-5 md:w-6 md:h-6" />, description: 'Como e quando passar o bastão para um humano.' },
];

export function OnboardingForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        // Step 1
        fullName: "",
        contactEmail: "",
        cpf: "",
        whatsapp: "",
        // Step 2
        companyName: "",
        cnpj: "",
        niche: "",
        address: "",
        targetAudience: "",
        instagram: "",
        // Step 3
        aiName: "",
        personaType: "", // 'assistant' | 'person'
        explicitAi: "", // 'yes' | 'no'
        toneOfVoice: "", // 'friendly', 'formal', etc.
        useEmojis: "",
        responseLength: "", // 'short', 'medium'
        // Step 4
        unknownAnswerAction: "",
        canMakeDecisions: "",
        avoidWords: "",
        frequentWords: "",
        // Step 5
        productsServices: "",
        painPoint: "",
        differentiators: "",
        priceObjections: "",
        files: [] as File[],
        // Step 6
        humanHandoffTrigger: "",
        top3Situations: ""
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            setFormData(prev => ({
                ...prev,
                files: [...prev.files, ...droppedFiles]
            }));
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFormData(prev => ({
                ...prev,
                files: [...prev.files, ...selectedFiles]
            }));
        }
    };

    const removeFile = (index: number) => {
        setFormData(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
    };

    const updateFormData = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentStep === steps.length - 1) {
            handleSubmit();
        } else {
            nextStep();
        }
    };
    const handleBack = () => prevStep();

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                // Remove data:image/png;base64, prefix to get raw base64
                const cleanBase64 = result.split(',')[1] || result;
                resolve(cleanBase64);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // Process files to Base64
            const filesBase64 = await Promise.all(
                formData.files.map(async (file) => ({
                    nome: file.name,
                    tipo: file.type,
                    tamanho: file.size,
                    conteudo: await fileToBase64(file)
                }))
            );

            // Construct organized payload in Portuguese
            const payload = {
                data_envio: new Date().toISOString(),
                informacoes_pessoais: {
                    nome_completo: formData.fullName,
                    email_contato: formData.contactEmail,
                    cpf: formData.cpf,
                    whatsapp: formData.whatsapp
                },
                perfil_empresa: {
                    nome_empresa: formData.companyName,
                    cnpj: formData.cnpj,
                    nicho_atuacao: formData.niche,
                    endereco: formData.address,
                    publico_alvo: formData.targetAudience,
                    instagram: formData.instagram
                },
                identidade_ia: {
                    nome_ia: formData.aiName,
                    tipo_persona: formData.personaType === 'person' ? 'Pessoa Física' : 'Assistente',
                    ia_explicita: formData.explicitAi === 'yes' ? 'Sim' : 'Não',
                    tom_de_voz: formData.toneOfVoice,
                    uso_emojis: formData.useEmojis === 'yes' ? 'Sim' : 'Não',
                    tamanho_resposta: formData.responseLength === 'short' ? 'Curta' : 'Média'
                },
                regras_atendimento: {
                    acao_resposta_desconhecida: formData.unknownAnswerAction,
                    pode_tomar_decisoes: formData.canMakeDecisions === 'yes' ? 'Sim' : 'Não',
                    palavras_evitar: formData.avoidWords,
                    palavras_usar: formData.frequentWords
                },
                base_conhecimento: {
                    produtos_servicos: formData.productsServices,
                    dor_que_resolve: formData.painPoint,
                    diferenciais: formData.differentiators,
                    objecoes_preco: formData.priceObjections,
                    arquivos_anexados: Array.isArray(filesBase64) ? filesBase64 : Object.values(filesBase64)
                },
                finalizacao: {
                    gatilho_humano: formData.humanHandoffTrigger,
                    top3_situacoes: formData.top3Situations
                }
            };

            // Send to Webhook
            const response = await fetch("https://autowebhook.seuserver.com/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Success handling
            setIsSuccess(true);
            window.scrollTo(0, 0);
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);
            alert("Ocorreu um erro ao enviar suas informações. Por favor, tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 0: // Pessoal
                return formData.fullName.trim() && formData.contactEmail.trim() && formData.cpf.trim() && formData.whatsapp.trim();
            case 1: // Empresa
                return formData.companyName.trim() && formData.cnpj.trim() && formData.address.trim() && formData.niche.trim() && formData.targetAudience.trim();
            case 2: // Identidade
                return formData.personaType && formData.explicitAi && formData.toneOfVoice && formData.useEmojis && formData.responseLength;
            case 3: // Regras
                return formData.unknownAnswerAction.trim() && formData.canMakeDecisions;
            case 4: // Conhecimento
                return formData.productsServices.trim() && formData.painPoint.trim() && formData.differentiators.trim();
            case 5: // Finalização
                return formData.humanHandoffTrigger.trim() && formData.top3Situations.trim();
            default:
                return true;
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // ETAPA 1: Informações Pessoais
                return (
                    <>
                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label htmlFor="fullName">Nome Completo <span className="text-red-500">*</span></Label>
                            <Input
                                id="fullName"
                                placeholder="Ex: João da Silva"
                                value={formData.fullName}
                                onChange={(e) => updateFormData("fullName", e.target.value)}
                            />
                        </motion.div>
                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label htmlFor="contactEmail">Email para Contato <span className="text-red-500">*</span></Label>
                            <Input
                                id="contactEmail"
                                type="email"
                                placeholder="Ex: joao@empresa.com.br"
                                value={formData.contactEmail}
                                onChange={(e) => updateFormData("contactEmail", e.target.value)}
                            />
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div variants={fadeInUp} className="space-y-2">
                                <Label htmlFor="cpf">CPF <span className="text-red-500">*</span></Label>
                                <Input
                                    id="cpf"
                                    placeholder="000.000.000-00"
                                    value={formData.cpf}
                                    onChange={(e) => updateFormData("cpf", e.target.value)}
                                />
                            </motion.div>
                            <motion.div variants={fadeInUp} className="space-y-2">
                                <Label htmlFor="whatsapp">WhatsApp de Contato <span className="text-red-500">*</span></Label>
                                <Input
                                    id="whatsapp"
                                    placeholder="(00) 00000-0000"
                                    value={formData.whatsapp}
                                    onChange={(e) => updateFormData("whatsapp", e.target.value)}
                                />
                            </motion.div>
                        </div>
                    </>
                );

            case 1: // ETAPA 2: Perfil da Empresa
                return (
                    <>
                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label htmlFor="companyName">Nome da Empresa ou Projeto <span className="text-red-500">*</span></Label>
                            <Input
                                id="companyName"
                                placeholder="Ex: Tech Solutions Ltda"
                                value={formData.companyName}
                                onChange={(e) => updateFormData("companyName", e.target.value)}
                            />
                        </motion.div>
                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label htmlFor="cnpj">CNPJ <span className="text-red-500">*</span></Label>
                            <Input
                                id="cnpj"
                                placeholder="00.000.000/0000-00"
                                value={formData.cnpj}
                                onChange={(e) => updateFormData("cnpj", e.target.value)}
                            />
                        </motion.div>
                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label htmlFor="niche">Nicho de Atuação <span className="text-red-500">*</span></Label>
                            <Input
                                id="niche"
                                placeholder="Ex: Odontologia, E-commerce de Roupas, Consultoria..."
                                value={formData.niche}
                                onChange={(e) => updateFormData("niche", e.target.value)}
                            />
                        </motion.div>
                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label htmlFor="address">Endereço Comercial Completo <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="address"
                                placeholder="Rua, número, bairro, cidade/UF e CEP"
                                value={formData.address}
                                onChange={(e) => updateFormData("address", e.target.value)}
                                className="min-h-[60px]"
                            />
                        </motion.div>
                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label htmlFor="targetAudience">Público-alvo da IA <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="targetAudience"
                                placeholder="Descreva quem a IA irá atender (idade, interesses, dores...)"
                                value={formData.targetAudience}
                                onChange={(e) => updateFormData("targetAudience", e.target.value)}
                            />
                        </motion.div>
                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label htmlFor="instagram">Site ou Instagram (Opcional)</Label>
                            <Input
                                id="instagram"
                                placeholder="@suaempresa ou www.suaempresa.com.br"
                                value={formData.instagram}
                                onChange={(e) => updateFormData("instagram", e.target.value)}
                            />
                        </motion.div>
                    </>
                );

            case 2: // ETAPA 3: Identidade e Transparência
                return (
                    <>
                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label htmlFor="aiName">Nome da IA (Se houver)</Label>
                            <Input
                                id="aiName"
                                placeholder="Ex: Atendente Virtual, Jarvis, Bia..."
                                value={formData.aiName}
                                onChange={(e) => updateFormData("aiName", e.target.value)}
                            />
                        </motion.div>

                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label>Como a IA deve se apresentar? <span className="text-red-500">*</span></Label>
                            <RadioGroup
                                value={formData.personaType}
                                onValueChange={(value) => updateFormData("personaType", value)}
                                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                            >
                                <div
                                    className={cn(
                                        "flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all",
                                        formData.personaType === "person"
                                            ? "border-[#4F46E5] bg-[#4F46E5]/5"
                                            : "border-neutral-800 hover:bg-[#171717]"
                                    )}
                                    onClick={() => updateFormData("personaType", "person")}
                                >
                                    <RadioGroupItem value="person" id="type-person" checked={formData.personaType === "person"} />
                                    <div className="flex flex-col">
                                        <Label className="cursor-pointer font-semibold text-white">Pessoa Física</Label>
                                        <span className="text-xs text-neutral-400">Passar-se por mim (Você)</span>
                                    </div>
                                    <User className="ml-auto text-neutral-500 h-5 w-5" />
                                </div>
                                <div
                                    className={cn(
                                        "flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all",
                                        formData.personaType === "assistant"
                                            ? "border-[#4F46E5] bg-[#4F46E5]/5"
                                            : "border-neutral-800 hover:bg-[#171717]"
                                    )}
                                    onClick={() => updateFormData("personaType", "assistant")}
                                >
                                    <RadioGroupItem value="assistant" id="type-assistant" checked={formData.personaType === "assistant"} />
                                    <div className="flex flex-col">
                                        <Label className="cursor-pointer font-semibold text-white">Assistente</Label>
                                        <span className="text-xs text-neutral-400">Avatar da empresa</span>
                                    </div>
                                    <Bot className="ml-auto text-neutral-500 h-5 w-5" />
                                </div>
                            </RadioGroup>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label>Deve dizer explicitamente que é uma IA? <span className="text-red-500">*</span></Label>
                            <RadioGroup
                                value={formData.explicitAi}
                                onValueChange={(value) => updateFormData("explicitAi", value)}
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => updateFormData("explicitAi", "yes")}>
                                    <RadioGroupItem value="yes" id="explicit-yes" checked={formData.explicitAi === "yes"} />
                                    <Label className="cursor-pointer">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => updateFormData("explicitAi", "no")}>
                                    <RadioGroupItem value="no" id="explicit-no" checked={formData.explicitAi === "no"} />
                                    <Label className="cursor-pointer">Não</Label>
                                </div>
                            </RadioGroup>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div variants={fadeInUp} className="space-y-2">
                                <Label>Tom de Voz <span className="text-red-500">*</span></Label>
                                <Select
                                    value={formData.toneOfVoice}
                                    onValueChange={(value) => updateFormData("toneOfVoice", value)}
                                >
                                    <SelectTrigger id="toneOfVoice">
                                        <SelectValue placeholder="Selecione o tom" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="friendly">Amigável e Casual</SelectItem>
                                        <SelectItem value="formal">Formal e Profissional</SelectItem>
                                        <SelectItem value="technical">Técnico e Especialista</SelectItem>
                                        <SelectItem value="persuasive">Persuasivo (Vendas)</SelectItem>
                                        <SelectItem value="empathetic">Empático e Atencioso</SelectItem>
                                    </SelectContent>
                                </Select>
                            </motion.div>
                            <motion.div variants={fadeInUp} className="space-y-2">
                                <Label>Uso de Emojis? <span className="text-red-500">*</span></Label>
                                <RadioGroup
                                    value={formData.useEmojis}
                                    onValueChange={(value) => updateFormData("useEmojis", value)}
                                    className="flex gap-4 mt-2"
                                >
                                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => updateFormData("useEmojis", "yes")}>
                                        <RadioGroupItem value="yes" id="emojis-yes" checked={formData.useEmojis === "yes"} />
                                        <Label className="cursor-pointer">Sim 😉</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => updateFormData("useEmojis", "no")}>
                                        <RadioGroupItem value="no" id="emojis-no" checked={formData.useEmojis === "no"} />
                                        <Label className="cursor-pointer">Não</Label>
                                    </div>
                                </RadioGroup>
                            </motion.div>
                        </div>

                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label>Tamanho das respostas <span className="text-red-500">*</span></Label>
                            <RadioGroup
                                value={formData.responseLength}
                                onValueChange={(value) => updateFormData("responseLength", value)}
                                className="space-y-2"
                            >
                                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => updateFormData("responseLength", "short")}>
                                    <RadioGroupItem value="short" id="len-short" checked={formData.responseLength === "short"} />
                                    <Label htmlFor="len-short" className="cursor-pointer">Curtas e diretas</Label>
                                </div>
                                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => updateFormData("responseLength", "medium")}>
                                    <RadioGroupItem value="medium" id="len-medium" checked={formData.responseLength === "medium"} />
                                    <Label htmlFor="len-medium" className="cursor-pointer">Médias e explicativas</Label>
                                </div>
                            </RadioGroup>
                        </motion.div>
                    </>
                );

            case 3: // ETAPA 4: Regras de Atendimento
                return (
                    <>
                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label htmlFor="unknownAnswerAction">O que fazer se não souber a resposta? <span className="text-red-500">*</span></Label>
                            <Input
                                id="unknownAnswerAction"
                                placeholder="Ex: Pedir para aguardar um humano, dizer que vai verificar..."
                                value={formData.unknownAnswerAction}
                                onChange={(e) => updateFormData("unknownAnswerAction", e.target.value)}
                            />
                        </motion.div>

                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label>A IA pode tomar decisões? <span className="text-red-500">*</span></Label>
                            <p className="text-xs text-neutral-500 mb-2">(Ex: Agendar reuniões, oferecer descontos)</p>
                            <RadioGroup
                                value={formData.canMakeDecisions}
                                onValueChange={(value) => updateFormData("canMakeDecisions", value)}
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => updateFormData("canMakeDecisions", "yes")}>
                                    <RadioGroupItem value="yes" id="decision-yes" checked={formData.canMakeDecisions === "yes"} />
                                    <Label htmlFor="decision-yes" className="cursor-pointer">Sim</Label>
                                </div>
                                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => updateFormData("canMakeDecisions", "no")}>
                                    <RadioGroupItem value="no" id="decision-no" checked={formData.canMakeDecisions === "no"} />
                                    <Label htmlFor="decision-no" className="cursor-pointer">Não</Label>
                                </div>
                            </RadioGroup>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label htmlFor="avoidWords" className="flex items-center gap-2">
                                Palavras/Expressões a EVITAR
                                <ShieldAlert className="h-4 w-4 text-red-500" />
                            </Label>
                            <Textarea
                                id="avoidWords"
                                placeholder="Ex: 'Não sei', 'Talvez', Gírias ofensivas..."
                                value={formData.avoidWords}
                                onChange={(e) => updateFormData("avoidWords", e.target.value)}
                            />
                        </motion.div>

                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label htmlFor="frequentWords" className="flex items-center gap-2">
                                Palavras/Expressões a USAR
                                <Zap className="h-4 w-4 text-[#00E3A5]" />
                            </Label>
                            <Textarea
                                id="frequentWords"
                                placeholder="Ex: 'Com certeza', 'Conte comigo', Slogans da marca..."
                                value={formData.frequentWords}
                                onChange={(e) => updateFormData("frequentWords", e.target.value)}
                            />
                        </motion.div>
                    </>
                );

            case 4: // ETAPA 5: Base de Conhecimento
                return (
                    <>
                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label htmlFor="productsServices">Principais Produtos/Serviços e Valores <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="productsServices"
                                placeholder="Liste o que você vende e os preços..."
                                value={formData.productsServices}
                                onChange={(e) => updateFormData("productsServices", e.target.value)}
                                className="min-h-[100px]"
                            />
                        </motion.div>
                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label htmlFor="painPoint">Principal "Dor" que resolve <span className="text-red-500">*</span></Label>
                            <Input
                                id="painPoint"
                                placeholder="Ex: Falta de tempo, Baixa produtividade..."
                                value={formData.painPoint}
                                onChange={(e) => updateFormData("painPoint", e.target.value)}
                            />
                        </motion.div>
                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label htmlFor="differentiators">Diferenciais da Empresa <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="differentiators"
                                placeholder="Por que o cliente deve escolher você?"
                                value={formData.differentiators}
                                onChange={(e) => updateFormData("differentiators", e.target.value)}
                            />
                        </motion.div>
                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label htmlFor="priceObjections">Como lidar com "Está caro"? (Opcional)</Label>
                            <Input
                                id="priceObjections"
                                placeholder="Argumentos de valor para contornar objeção de preço..."
                                value={formData.priceObjections}
                                onChange={(e) => updateFormData("priceObjections", e.target.value)}
                            />
                        </motion.div>

                        {/* File Upload Area */}
                        <motion.div variants={fadeInUp} className="space-y-2 mt-4">
                            <Label>Upload de Manuais/FAQ (Opcional)</Label>
                            <div
                                className={cn(
                                    "border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer relative",
                                    isDragging
                                        ? "border-[#00E3A5] bg-[#00E3A5]/10"
                                        : "border-neutral-700 hover:border-[#4F46E5] bg-[#171717]/50"
                                )}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    multiple
                                    onChange={handleFileSelect}
                                />
                                <Upload className={cn(
                                    "h-8 w-8 mb-2 transition-colors",
                                    isDragging ? "text-[#00E3A5]" : "text-neutral-400"
                                )} />
                                <p className="text-sm text-neutral-300 font-medium">
                                    {isDragging ? "Solte os arquivos aqui" : "Clique ou arraste arquivos aqui"}
                                </p>
                                <p className="text-xs text-neutral-500 mt-1">PDF, DOCX, TXT (Max 10MB)</p>
                            </div>

                            {/* File List */}
                            {formData.files.length > 0 && (
                                <div className="space-y-2 mt-2">
                                    {formData.files.map((file, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-[#171717] border border-neutral-800 rounded-lg text-sm">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <FileIcon className="h-4 w-4 text-[#4F46E5] shrink-0" />
                                                <span className="truncate text-neutral-300">{file.name}</span>
                                                <span className="text-xs text-neutral-500 shrink-0">({(file.size / 1024).toFixed(0)}kb)</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFile(index);
                                                }}
                                                className="p-1 hover:bg-neutral-800 rounded-full transition-colors"
                                            >
                                                <X className="h-4 w-4 text-neutral-500 hover:text-red-400" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </>
                );

            case 5: // ETAPA 6: Finalização e Transição
                return (
                    <>
                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label htmlFor="humanHandoffTrigger">Quando transferir para humano? <span className="text-red-500">*</span></Label>
                            <Input
                                id="humanHandoffTrigger"
                                placeholder="Ex: Cliente irritado, Pedido de cancelamento, Assunto complexo..."
                                value={formData.humanHandoffTrigger}
                                onChange={(e) => updateFormData("humanHandoffTrigger", e.target.value)}
                            />
                        </motion.div>
                        <motion.div variants={fadeInUp} className="space-y-2">
                            <Label htmlFor="top3Situations">3 Situações mais comuns a resolver <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="top3Situations"
                                placeholder="1. Agendar visita, 2. Enviar orçamento, 3. Tirar dúvida técnica..."
                                value={formData.top3Situations}
                                onChange={(e) => updateFormData("top3Situations", e.target.value)}
                            />
                        </motion.div>
                    </>
                );
            default:
                return null;
        }
    };

    // Renderização da Tela de Sucesso
    if (isSuccess) {
        // Variantes para animação em cascata da lista
        const containerVariants = {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.2,
                    delayChildren: 0.3
                }
            }
        };

        const itemVariants = {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        };

        return (
            <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                >
                    <div className="w-24 h-24 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-6 shadow-[0_0_30px_-5px_rgba(34,197,94,0.4)]">
                        <Check className="h-12 w-12" />
                    </div>
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-white mb-2"
                >
                    Formulário Enviado!
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-neutral-400 max-w-md mx-auto mb-8"
                >
                    Recebemos seus dados com sucesso. A próxima etapa da magia está prestes a começar!
                </motion.p>

                {/* Lista de Próximos Passos */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-md w-full bg-[#171717] border border-neutral-800 rounded-xl p-6 text-left mb-8"
                >
                    <h3 className="text-white font-medium mb-4 pb-2 border-b border-neutral-800">O que acontece agora?</h3>
                    <ul className="space-y-6">
                        <motion.li variants={itemVariants} className="flex items-start gap-3">
                            <FileText className="h-6 w-6 text-[#4F46E5] mt-1 shrink-0" />
                            <div>
                                <span className="text-white font-semibold text-lg">Geração do Contrato:</span>
                                <p className="text-neutral-400 text-sm mt-1">Você receberá o documento para assinatura no e-mail informado em instantes.</p>
                            </div>
                        </motion.li>

                        <motion.li variants={itemVariants} className="flex items-start gap-3">
                            <Video className="h-6 w-6 text-[#4F46E5] mt-1 shrink-0" />
                            <div>
                                <span className="text-white font-semibold text-lg">Call de Alinhamento:</span>
                                <p className="text-neutral-400 text-sm mt-1">Essa será a primeira call do projeto para recolher todos os acessos necessários para início.</p>
                            </div>
                        </motion.li>

                        <motion.li variants={itemVariants} className="flex items-start gap-3">
                            <Bot className="h-6 w-6 text-[#4F46E5] mt-1 shrink-0" />
                            <div>
                                <span className="text-white font-semibold text-lg">Configuração da IA:</span>
                                <p className="text-neutral-400 text-sm mt-1">Com base nas regras que você definiu, iniciaremos o treinamento do 'cérebro' do seu assistente agora mesmo.</p>
                            </div>
                        </motion.li>
                    </ul>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-neutral-500 text-sm"
                >
                    Se tiver qualquer dúvida imediata, basta nos chamar no suporte.
                </motion.p>
            </div>
        );
    }

    // MAIN FORM RENDER
    return (
        <div className="w-full h-full md:h-auto md:max-h-full max-w-3xl mx-auto flex flex-col bg-[#0A0A0A] md:bg-transparent">
            {/* Progress indicator */}
            <motion.div
                className="shrink-0 px-4 pt-4 md:pt-0 mb-4 md:mb-8 bg-black/50 backdrop-blur-md md:bg-transparent z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-between mb-2 md:mb-4 px-2">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center relative z-10 group cursor-pointer"
                            onClick={() => {
                                // Permitir voltar, avançar apenas se válido
                                if (index < currentStep || (index === currentStep + 1 && isStepValid())) {
                                    setCurrentStep(index);
                                }
                            }}
                        >
                            <motion.div
                                className={cn(
                                    "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                                    index < currentStep
                                        ? "bg-[#00E3A5] border-[#00E3A5] text-[#0A0A0A] shadow-[0_0_10px_rgba(0,227,165,0.4)]"
                                        : index === currentStep
                                            ? "bg-[#0A0A0A] border-[#00E3A5] text-[#00E3A5] ring-2 ring-[#00E3A5]/20 shadow-[0_0_15px_rgba(0,227,165,0.2)]"
                                            : "bg-[#171717] border-neutral-700 text-neutral-500"
                                )}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {index < currentStep ? <Check className="h-3 w-3 md:h-4 md:w-4 font-bold" strokeWidth={3} /> : <span className="text-[10px] md:text-xs font-bold">{index + 1}</span>}
                            </motion.div>
                            <span className={cn(
                                "text-[10px] uppercase tracking-wider font-semibold mt-2 absolute -bottom-6 w-24 text-center transition-colors duration-300 hidden md:block",
                                index === currentStep ? "text-[#00E3A5]" : "text-neutral-600"
                            )}>
                                {step.title.split(' ')[0]}
                            </span>
                        </div>
                    ))}
                    {/* Progress Bar Background */}
                    <div className="absolute top-3 md:top-4 left-0 w-full h-[2px] bg-neutral-800 -z-0 hidden md:block" />
                </div>

                {/* Mobile Progress Bar */}
                <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden mt-4 md:mt-10 mb-2">
                    <motion.div
                        className="h-full bg-[#00E3A5] shadow-[0_0_10px_#00E3A5]"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <div className="md:hidden text-center text-xs text-[#00E3A5] font-medium mt-1">
                    {steps[currentStep].title}
                </div>
            </motion.div>

            {/* Main Card Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 flex flex-col min-h-0 overflow-hidden"
            >
                <Card className="flex-1 flex flex-col border-0 md:border border-neutral-800 shadow-none md:shadow-2xl rounded-none md:rounded-2xl overflow-hidden bg-[#0A0A0A] h-full">
                    <div className="flex flex-col h-full w-full">
                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent p-4 md:p-6">
                            <CardHeader className="px-0 md:px-0 pt-0 pb-6">
                                <CardTitle className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                                    {steps[currentStep].icon}
                                    {steps[currentStep].title}
                                </CardTitle>
                                <CardDescription className="text-neutral-400 mt-2">
                                    {steps[currentStep].description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 px-0 md:px-0 pb-4">
                                {renderStepContent()}
                            </CardContent>
                        </div>

                        {/* Static Footer (Always visible at bottom of flex container) */}
                        <div className="shrink-0 p-4 md:p-6 py-4 bg-[#0A0A0A] border-t border-neutral-800 z-10 flex justify-between items-center shadow-[0_-5px_10px_rgba(0,0,0,0.3)]">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStep === 0}
                                className={cn(
                                    "border-neutral-700 hover:bg-neutral-800 hover:text-white transition-all duration-300",
                                    currentStep === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
                                )}
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
                            </Button>

                            <div className="flex items-center gap-4">
                                <span className="text-xs text-neutral-500 hidden md:block">
                                    Passo {currentStep + 1} de {steps.length}
                                </span>
                                <Button
                                    onClick={handleNext}
                                    disabled={!isStepValid() || isSubmitting}
                                    className={cn(
                                        "bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white border border-transparent transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.5)]",
                                        (!isStepValid() || isSubmitting) && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Enviando
                                        </>
                                    ) : (
                                        <>
                                            {currentStep === steps.length - 1 ? (
                                                <>Finalizar <ChevronRight className="ml-2 h-4 w-4" /></>
                                            ) : (
                                                <>Próximo <ChevronRight className="ml-2 h-4 w-4" /></>
                                            )}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
