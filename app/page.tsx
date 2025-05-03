"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// Adicionar o import do ícone FolderOpen
import { ChevronDown, ChevronRight, Calendar, Upload, FolderOpen } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TecnicosMateriais() {
  // Estado para controlar quais técnicos estão expandidos
  const [expandedTecnicos, setExpandedTecnicos] = useState<number[]>([])
  // Estado para controlar quais materiais estão expandidos
  const [expandedMateriais, setExpandedMateriais] = useState<{ [key: string]: boolean }>({})

  // Data de atualização - você pode alterar esta data sempre que atualizar o site
  const dataAtualizacao = "02/05/2025"

  // Função para alternar a expansão de um técnico
  const toggleTecnico = (index: number) => {
    if (expandedTecnicos.includes(index)) {
      setExpandedTecnicos(expandedTecnicos.filter((i) => i !== index))
    } else {
      setExpandedTecnicos([...expandedTecnicos, index])
    }
  }

  // Função para alternar a expansão de um material
  const toggleMaterial = (tecnicoIndex: number, materialIndex: number) => {
    const key = `${tecnicoIndex}-${materialIndex}`
    setExpandedMateriais((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Função para obter as iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const tecnicos = [
    {
      nome: "Bruno",
      foto: "https://play-lh.googleusercontent.com/sHrCeH4lpnZQHC40hu8Kh6UfZ3nyG_LvOHniRT4iK_kFuOTnBaLgrbgoG8nGF4vEYkE=w526-h296-rw",
      materiais: [
        {
          nome: "HFC-CASA",
          detalhes:
            "- 22056333:ABRACADEIRA NYLON T18R 10CM BRANCA: 10\n- 22066634:ACOPLADOR DIREC RI 1S 06DB 1.2G HORIZONT: 1\n- 22025321:ANEL VEDACAO PLASTICA P PORTA F:	2\n- 22025136:BUCHA ACABAMENTO CABO RG6-59 BRANCA:2\n- 22026223:CABO COAXIAL RG6 TRISH COM MENSAG PRETO: 50\n- 22026219: CABO COAXIAL RG6 TRISH SEM MENSAG BRANCO: 50\n- 22026189: CONEC_RI COMPRESSAO F-6: 8\n- 22057635: FIXADOR FIO PT RG6: 60\n- 22025139: FIXADOR FIO BR RG6 CIRCUL 7MM: 60\n-	22062573: FONTE ALIM 12V 2.5A MSA C2500IC12030WBR: 1\n- 22056366: ISOLADOR COAXIAL QUADRADO - CISP-HR: 1\n- 22067384: MINI ISOLADOR CPE CABLE MODEM E DECODER: 1\n-	22061434: PITAO COM FLANGE E BUCHA S10: 2\n- 22026544: SUPORTE GALVANIZADO U SPAN CLAMP: 2\n- 22026199: CONECTOR TERMINACAO 75 OHMS: 2\n- 22025162: MARCADOR APTO NUM 0 TIPO HO85 AMARELO	: 1 OU A QUANTIDADE USADA\n- 22025250: MARCADOR APTO NUM 1 TIPO HO85 AMARELO: 1 OU A QUANTIDADE USADA",
        },
        {
          nome: "Multímetro",
          quantidade: 1,
          detalhes:
            "Multímetro digital com medição de tensão AC/DC, corrente e resistência\n- 1x Multímetro digital\n- 1x Par de pontas de prova\n- 1x Bateria 9V",
        },
        {
          nome: "Fita isolante",
          quantidade: 5,
          detalhes:
            "Fita isolante antichama de 20 metros, cor preta\n- 3x Fita isolante preta\n- 1x Fita isolante vermelha\n- 1x Fita isolante azul",
        },
        {
          nome: "Chave de fenda",
          quantidade: 3,
          detalhes:
            'Conjunto com 3 chaves de fenda de diferentes tamanhos\n- 1x Chave de fenda 1/8"\n- 1x Chave de fenda 3/16"\n- 1x Chave de fenda 1/4"',
        },
      ],
    },
    {
      nome: "Jarbas",
      foto: "/placeholder.svg?height=40&width=40",
      materiais: [
        {
          nome: "Chave de grifo",
          quantidade: 2,
          detalhes:
            'Chave de grifo de 10 e 12 polegadas para tubulações\n- 1x Chave de grifo 10"\n- 1x Chave de grifo 12"',
        },
        {
          nome: "Veda rosca",
          quantidade: 4,
          detalhes: "Fita veda rosca de 18mm x 50m para conexões\n- 4x Rolos de fita veda rosca",
        },
        {
          nome: "Desentupidor",
          quantidade: 1,
          detalhes: "Desentupidor de pia e ralos com cabo de madeira\n- 1x Desentupidor de borracha com cabo",
        },
        {
          nome: "Chave inglesa",
          quantidade: 2,
          detalhes: 'Chaves inglesas ajustáveis de 8 e 12 polegadas\n- 1x Chave inglesa 8"\n- 1x Chave inglesa 12"',
        },
      ],
    },
    {
      nome: "Julio",
      foto: "/placeholder.svg?height=40&width=40",
      materiais: [
        {
          nome: "Serra circular",
          quantidade: 1,
          detalhes:
            "Serra circular elétrica de 7¼ polegadas, 1800W\n- 1x Serra circular\n- 2x Discos de corte para madeira\n- 1x Chave de ajuste",
        },
        {
          nome: "Lixadeira",
          quantidade: 2,
          detalhes:
            "Lixadeira orbital e lixadeira de cinta para acabamentos\n- 1x Lixadeira orbital\n- 1x Lixadeira de cinta\n- 10x Folhas de lixa sortidas",
        },
        {
          nome: "Cola para madeira",
          quantidade: 3,
          detalhes: "Cola branca para madeira, secagem rápida, 1kg cada\n- 3x Embalagens de cola para madeira",
        },
        {
          nome: "Formão",
          quantidade: 4,
          detalhes:
            'Kit com 4 formões de diferentes tamanhos para entalhe\n- 1x Formão 1/4"\n- 1x Formão 1/2"\n- 1x Formão 3/4"\n- 1x Formão 1"',
        },
      ],
    },
    {
      nome: "Luan",
      foto: "/placeholder.svg?height=40&width=40",
      materiais: [
        {
          nome: "Colher de pedreiro",
          quantidade: 2,
          detalhes:
            "Colheres de pedreiro nº 8 e nº 10 com cabo de madeira\n- 1x Colher de pedreiro nº 8\n- 1x Colher de pedreiro nº 10",
        },
        {
          nome: "Nível",
          quantidade: 1,
          detalhes: "Nível de alumínio com 3 bolhas, 60cm\n- 1x Nível de alumínio 60cm",
        },
        {
          nome: "Desempenadeira",
          quantidade: 3,
          detalhes:
            "Desempenadeiras de aço, plástico e madeira para diferentes acabamentos\n- 1x Desempenadeira de aço\n- 1x Desempenadeira de plástico\n- 1x Desempenadeira de madeira",
        },
        {
          nome: "Prumo",
          quantidade: 1,
          detalhes:
            "Prumo de centro de 500g para alinhamento vertical\n- 1x Prumo de centro 500g\n- 1x Cordão de nylon",
        },
      ],
    },
    {
      nome: "Matheus",
      foto: "/placeholder.svg?height=40&width=40",
      materiais: [
        {
          nome: "Rolo de pintura",
          quantidade: 4,
          detalhes:
            "Rolos de diferentes tamanhos para paredes e detalhes\n- 1x Rolo de lã 23cm\n- 1x Rolo de espuma 15cm\n- 1x Rolo para cantos\n- 1x Mini rolo para detalhes",
        },
        {
          nome: "Pincel",
          quantidade: 6,
          detalhes:
            'Kit com 6 pincéis de diferentes espessuras para acabamentos\n- 1x Pincel 1/2"\n- 1x Pincel 1"\n- 1x Pincel 1 1/2"\n- 1x Pincel 2"\n- 1x Pincel 2 1/2"\n- 1x Pincel 3"',
        },
        {
          nome: "Fita crepe",
          quantidade: 8,
          detalhes: "Fitas crepe de 25mm para mascaramento, pacote com 8 unidades\n- 8x Rolos de fita crepe 25mm",
        },
        {
          nome: "Bandeja",
          quantidade: 2,
          detalhes: "Bandejas plásticas para pintura com rolo\n- 2x Bandejas plásticas para pintura",
        },
      ],
    },
    {
      nome: "Ruan",
      foto: "/placeholder.svg?height=40&width=40",
      materiais: [
        {
          nome: "Manifold",
          quantidade: 1,
          detalhes:
            "Manifold com mangueiras para R22, R134a e R410a\n- 1x Manifold\n- 3x Mangueiras coloridas\n- 1x Estojo para transporte",
        },
        {
          nome: "Bomba de vácuo",
          quantidade: 1,
          detalhes:
            "Bomba de vácuo de 5CFM para sistemas de refrigeração\n- 1x Bomba de vácuo 5CFM\n- 1x Óleo para bomba de vácuo",
        },
        {
          nome: "Detector de vazamento",
          quantidade: 2,
          detalhes:
            "Detector eletrônico de vazamento de gás refrigerante\n- 1x Detector eletrônico\n- 1x Detector por bolhas\n- 2x Baterias sobressalentes",
        },
        {
          nome: "Alicate amperímetro",
          quantidade: 1,
          detalhes:
            "Alicate amperímetro digital com medição de temperatura\n- 1x Alicate amperímetro\n- 1x Par de pontas de prova\n- 1x Sensor de temperatura",
        },
      ],
    },
    {
      nome: "Ryan",
      foto: "/placeholder.svg?height=40&width=40",
      materiais: [
        {
          nome: "Chave Phillips",
          quantidade: 2,
          detalhes:
            "Chaves Phillips #0 e #1 para componentes eletrônicos\n- 1x Chave Phillips #0\n- 1x Chave Phillips #1",
        },
        {
          nome: "Kit de ferramentas",
          quantidade: 1,
          detalhes:
            "Kit com 45 peças para manutenção de computadores e notebooks\n- 1x Estojo com 45 peças\n- 1x Pulseira antiestática\n- 1x Pinça\n- Diversas chaves e adaptadores",
        },
        {
          nome: "Pasta térmica",
          quantidade: 3,
          detalhes: "Pasta térmica de alta condutividade para processadores\n- 3x Seringas de pasta térmica",
        },
        {
          nome: "Pulseira antiestática",
          quantidade: 1,
          detalhes:
            "Pulseira antiestática com cabo de aterramento\n- 1x Pulseira antiestática\n- 1x Cabo de aterramento",
        },
      ],
    },
    {
      nome: "Serralheiro",
      foto: "/placeholder.svg?height=40&width=40",
      materiais: [
        {
          nome: "Máquina de solda",
          quantidade: 1,
          detalhes:
            "Máquina de solda inversora 200A para eletrodos até 4mm\n- 1x Máquina de solda inversora\n- 1x Cabo porta-eletrodo\n- 1x Cabo terra\n- 1x Máscara de solda",
        },
        {
          nome: "Disco de corte",
          quantidade: 10,
          detalhes: "Discos de corte para metal, 115mm, pacote com 10 unidades\n- 10x Discos de corte 115mm",
        },
        {
          nome: "Esquadro",
          quantidade: 2,
          detalhes:
            "Esquadros metálicos de 30cm e 50cm para medições\n- 1x Esquadro metálico 30cm\n- 1x Esquadro metálico 50cm",
        },
        {
          nome: "Lixadeira angular",
          quantidade: 1,
          detalhes:
            "Lixadeira angular de 4½ polegadas, 850W\n- 1x Lixadeira angular\n- 5x Discos de desbaste\n- 5x Discos de lixa",
        },
      ],
    },
    {
      nome: "Jardineiro",
      foto: "/placeholder.svg?height=40&width=40",
      materiais: [
        {
          nome: "Tesoura de poda",
          quantidade: 2,
          detalhes:
            "Tesouras de poda para galhos finos e médios\n- 1x Tesoura de poda pequena\n- 1x Tesoura de poda grande",
        },
        {
          nome: "Enxada",
          quantidade: 1,
          detalhes: "Enxada com cabo de madeira de 150cm\n- 1x Enxada com cabo de madeira",
        },
        {
          nome: "Regador",
          quantidade: 3,
          detalhes:
            "Regadores plásticos de diferentes capacidades\n- 1x Regador 5L\n- 1x Regador 10L\n- 1x Regador de pressão 2L",
        },
        {
          nome: "Luvas",
          quantidade: 4,
          detalhes: "Pares de luvas de jardinagem resistentes a espinhos\n- 4x Pares de luvas de jardinagem",
        },
      ],
    },
  ]

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
      }}
    >
      {/* Componente de data de atualização */}
      <div className="fixed top-2 right-4 z-50 bg-white/90 px-3 py-1.5 rounded-md shadow-md flex items-center gap-1.5 text-sm font-medium border border-slate-200">
        <Calendar className="h-4 w-4 text-slate-500" />
        <span>Data de atualização: {dataAtualizacao}</span>
      </div>

      {/* Botão para acessar área de administração */}
      <div className="fixed top-2 left-4 z-50">
        <Link href="/login">
          <Button variant="outline" className="bg-white/90 border border-slate-200 shadow-md">
            Área do Administrador
          </Button>
        </Link>
      </div>

      <div className="min-h-screen bg-white/80">
        <div className="container mx-auto py-8 pt-16">
          {/* Cabeçalho com título e logo */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center md:text-left">Lista de Materiais</h1>
            <div className="mt-4 md:mt-0 flex items-center justify-center">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 flex items-center justify-center bg-gray-50">
                <div className="w-40 h-16 relative">
                  <Image
                    src="https://cdn.teletime.com.br/wp-content/uploads/2023/02/claro_waifu2x_photo_noise3_scale-696x391.jpg?height=64&width=160"
                    alt="Logo da Empresa"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botão para enviar fotos de erros */}
          <div className="mb-8 flex flex-col sm:flex-row gap-2">
            <Link href="/upload">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Enviar Foto de Erro
              </Button>
            </Link>
            <Link href="/files">
              <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Acessar Arquivos
              </Button>
            </Link>
          </div>

          {/* Lista de técnicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tecnicos.map((tecnico, tecnicoIndex) => (
              <Collapsible
                key={tecnicoIndex}
                open={expandedTecnicos.includes(tecnicoIndex)}
                className="shadow-md hover:shadow-lg transition-shadow rounded-md border bg-white"
              >
                <CollapsibleTrigger className="w-full text-left" onClick={() => toggleTecnico(tecnicoIndex)}>
                  <Card className="border-0 shadow-none">
                    <CardHeader className="bg-slate-100 flex flex-row items-center justify-between rounded-t-md">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-slate-200">
                          <AvatarImage src={tecnico.foto || "/placeholder.svg"} alt={`Foto de ${tecnico.nome}`} />
                          <AvatarFallback className="bg-slate-300 text-slate-600">
                            {getInitials(tecnico.nome)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{tecnico.nome}</CardTitle>
                          <CardDescription>Lista de materiais necessários</CardDescription>
                        </div>
                      </div>
                      {expandedTecnicos.includes(tecnicoIndex) ? (
                        <ChevronDown className="h-5 w-5 text-slate-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-slate-500" />
                      )}
                    </CardHeader>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 gap-3">
                      {tecnico.materiais.map((material, materialIndex) => {
                        const materialKey = `${tecnicoIndex}-${materialIndex}`
                        const isExpanded = expandedMateriais[materialKey]

                        return (
                          <Collapsible
                            key={materialIndex}
                            open={isExpanded}
                            className="border border-slate-200 rounded-md"
                          >
                            <CollapsibleTrigger
                              className="w-full text-left"
                              onClick={() => toggleMaterial(tecnicoIndex, materialIndex)}
                            >
                              <Card className="border-0 shadow-none">
                                <CardContent className="p-3 flex justify-between items-center">
                                  <span className="font-medium">{material.nome}</span>
                                  <div className="flex items-center gap-2">
                                    {material.quantidade && (
                                      <span className="bg-slate-100 px-3 py-1 rounded-full text-sm font-semibold">
                                        Qtd: {material.quantidade}
                                      </span>
                                    )}
                                    {isExpanded ? (
                                      <ChevronDown className="h-4 w-4 text-slate-500" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-slate-500" />
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="px-3 pb-3 text-sm text-slate-600 border-t border-slate-100 pt-2">
                                {material.detalhes.split("\n").map((line, i) => (
                                  <p key={i} className="mb-1 last:mb-0">
                                    {line}
                                  </p>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        )
                      })}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
