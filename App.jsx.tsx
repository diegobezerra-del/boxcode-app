import { useState, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// WOD LIBRARY — 88 WODs criados por Coach Level 4
// Organizados por fundamento do dia
// ═══════════════════════════════════════════════════════════════
const WOD_LIBRARY = [
  // CLEAN
  {id:1,  fund:"clean",      name:"CLEAN LADDER",      cat:"Halterofilia", type:"EMOM 12min",         tc:"12min", lvl:"RX",    rx:"Power Clean 70/47kg",      scaled:"HPC 50/35kg",          icon:"🏋️", moves:["Min impar: 3 Power Clean","Min par: 3 Push Jerk"],                                    reps:"EMOM 12min",   desc:"Ciclar barbell com tecnica. Cotovelos rapidos na recepcao."},
  {id:2,  fund:"clean",      name:"CLEAN STORM",       cat:"Halterofilia", type:"For Time",           tc:"12min", lvl:"RX",    rx:"HPC 60/43kg, BJ 60cm",     scaled:"HPC 43/30kg, BJ 50cm", icon:"⚡",  moves:["21-15-9 Hang Power Clean 60/43kg","21-15-9 Box Jump Over 60/50cm"],                    reps:"21-15-9",      desc:"Potencia de quadril combinada. Mesma extensao no clean e no box jump."},
  {id:3,  fund:"clean",      name:"COMPLEXO DUPLO",    cat:"Halterofilia", type:"E2MOM 16min",        tc:"16min", lvl:"RX",    rx:"Squat Clean 75% 1RM",      scaled:"Power Clean 70%",      icon:"💪",  moves:["E2MOM: 1 Squat Clean + 1 Hang Squat Clean + 1 Split Jerk"],                           reps:"8 sets",       desc:"Nao quebre o complexo - 3 movimentos em sequencia."},
  {id:4,  fund:"clean",      name:"IRON CLEAN",        cat:"Metcon",       type:"5 Rounds For Time",  tc:"20min", lvl:"RX",    rx:"PC 60/43kg, BJ 60cm",      scaled:"50/35kg, 50cm",        icon:"💥",  moves:["7 Power Clean 60/43kg","14 Box Jump 60cm","200m Run"],                                 reps:"5 rounds",     desc:"Resistencia de forca. Mantenha postura mesmo no final."},
  {id:5,  fund:"clean",      name:"GRACE TECNICA",     cat:"Classico",     type:"For Time",           tc:"10min", lvl:"RX",    rx:"Clean & Jerk 60/43kg",     scaled:"43/30kg",              icon:"🔥",  moves:["30 Clean & Jerk"],                                                                     reps:"30 reps",      desc:"Dip & drive eficiente. Nao muscle o press."},
  {id:6,  fund:"clean",      name:"DT CLASSICO",       cat:"Hero WOD",     type:"5 Rounds For Time",  tc:"25min", lvl:"RX",    rx:"70/47kg mesma barra",      scaled:"50/35kg",              icon:"🎖️", moves:["12 Deadlift 70/47kg","9 Hang Power Clean","6 Push Jerk"],                              reps:"5 rounds",     desc:"Nao solte a barra. 27 reps por round sem larga-la."},
  // SNATCH
  {id:7,  fund:"snatch",     name:"SNATCH FLOW",       cat:"Halterofilia", type:"EMOM 10min",         tc:"10min", lvl:"RX",    rx:"Power Snatch 50/35kg",     scaled:"35/25kg",              icon:"⚡",  moves:["EMOM: 3 Power Snatch cycling rapido"],                                                 reps:"10 rounds",    desc:"30 snatches em 10min. Mesma amplitude em todos."},
  {id:8,  fund:"snatch",     name:"SNATCH CHIPPER",    cat:"Halterofilia", type:"For Time",           tc:"18min", lvl:"RX",    rx:"Snatch 50/35kg",           scaled:"35/25kg",              icon:"💫",  moves:["30 Power Snatch","30 Box Jump Over 60/50cm","20 OHS","20 Burpee","10 Squat Snatch"],    reps:"chipper",      desc:"Progressao do power ao squat snatch. Nao perca overhead no final."},
  {id:9,  fund:"snatch",     name:"OHS COMPLEX",       cat:"Halterofilia", type:"AMRAP 12min",        tc:"12min", lvl:"RX",    rx:"OHS 43/30kg",              scaled:"30/20kg",              icon:"🙌",  moves:["5 OHS 43/30kg","10 Double Under","5 Hang Snatch","10 Double Under"],                    reps:"AMRAP 12min",  desc:"DU como descansso ativo. Estabilidade overhead sob fadiga."},
  {id:10, fund:"snatch",     name:"ISABEL VARIACAO",   cat:"Classico",     type:"For Time",           tc:"10min", lvl:"RX",    rx:"Snatch 60/43kg + CTB",     scaled:"43/30kg + PU",         icon:"🏋️", moves:["21 Squat Snatch","15 CTB Pull-Up","9 Squat Snatch"],                                    reps:"21-15-9",      desc:"Potencia overhead + puxada. Use o topo do snatch para respirar."},
  // DEADLIFT
  {id:11, fund:"deadlift",   name:"DEAD PULL",         cat:"Forca",        type:"For Time",           tc:"15min", lvl:"RX",    rx:"DL 102/70kg",              scaled:"70/47kg",              icon:"💪",  moves:["21-15-9 Deadlift 102/70kg","21-15-9 Box Jump 60/50cm","21-15-9 HSPU"],                  reps:"21-15-9",      desc:"Reinicie posicao em cada DL. Sem amortecimento."},
  {id:12, fund:"deadlift",   name:"HEAVY METCON",      cat:"Metcon",       type:"AMRAP 15min",        tc:"15min", lvl:"RX",    rx:"DL 120/80kg",              scaled:"80/55kg",              icon:"🔥",  moves:["3 Deadlift 120/80kg","6 Burpee Over Bar","9 Box Jump 60cm"],                           reps:"AMRAP 15min",  desc:"Carga alta com volume baixo. Qualidade em cada DL."},
  {id:13, fund:"deadlift",   name:"PULL & PUSH",       cat:"Metcon",       type:"4 Rounds For Time",  tc:"18min", lvl:"RX",    rx:"DL 100/70kg",              scaled:"70/47kg",              icon:"💥",  moves:["10 Deadlift 100/70kg","10 HSPU","10 Box Jump 60cm","200m Run"],                         reps:"4 rounds",     desc:"Pull + Push + Monostructural. Sessao completa."},
  {id:14, fund:"deadlift",   name:"DIANE NOVA",        cat:"Classico",     type:"For Time",           tc:"12min", lvl:"RX",    rx:"DL 102/70kg + HSPU",       scaled:"70/47kg + Pike PU",    icon:"💪",  moves:["21-15-9 Deadlift 102/70kg","21-15-9 HSPU"],                                           reps:"21-15-9",      desc:"Ciclar DL rapido para ter energia no HSPU."},
  // BACK SQUAT
  {id:15, fund:"back_squat", name:"SQUAT AMRAP",       cat:"Metcon",       type:"AMRAP 15min",        tc:"15min", lvl:"RX",    rx:"BS 80/55kg",               scaled:"60/40kg",              icon:"🦴",  moves:["5 Back Squat 80/55kg","10 Pull-Up","15 Cal Row"],                                      reps:"AMRAP 15min",  desc:"Descanse nas pernas durante pull e remo."},
  {id:16, fund:"back_squat", name:"LEG DESTROYER",     cat:"Metcon",       type:"For Time",           tc:"20min", lvl:"RX",    rx:"BS/FS/OHS 70/50kg",        scaled:"50/35kg",              icon:"🔥",  moves:["30 Back Squat 70/50kg","400m Run","20 Front Squat","400m Run","10 OHS","400m Run"],      reps:"chipper",      desc:"Do mais facil ao mais tecnico. OHS no final e o teste real."},
  {id:17, fund:"back_squat", name:"SQUAT INTERVALS",   cat:"Forca",        type:"E3MOM 15min",        tc:"15min", lvl:"RX",    rx:"BS 85% 1RM",               scaled:"75%",                  icon:"🦵",  moves:["E3MOM: 5 Back Squat @ 85% 1RM"],                                                      reps:"5 sets",       desc:"Descanso real entre sets. Qualidade acima de tudo."},
  // FRONT SQUAT
  {id:18, fund:"front_squat",name:"FRONT FIRE",        cat:"Metcon",       type:"For Time",           tc:"15min", lvl:"RX",    rx:"FS 70/47kg",               scaled:"50/35kg",              icon:"🏋️", moves:["21 Front Squat 70/47kg","15 TTB","15 Front Squat","15 TTB","9 Front Squat","15 TTB"],   reps:"combo",        desc:"Cotovelos altos mesmo cansado - nao negocie posicao."},
  {id:19, fund:"front_squat",name:"RACK ATTACK",       cat:"Metcon",       type:"AMRAP 12min",        tc:"12min", lvl:"RX",    rx:"FS + PP 70/50kg",          scaled:"50/35kg",              icon:"💥",  moves:["7 Front Squat 70/50kg","7 Push Press 70/50kg","14 Wall Ball 9/6kg"],                    reps:"AMRAP 12min",  desc:"Tudo overhead. Respira fundo antes de cada squat."},
  // THRUSTER
  {id:20, fund:"thruster",   name:"FRAN",              cat:"Classico",     type:"For Time",           tc:"10min", lvl:"RX",    rx:"Thruster 43/30kg",         scaled:"30/20kg + Ring Row",   icon:"⚡",  moves:["21-15-9 Thruster 43/30kg","21-15-9 Pull-Up"],                                          reps:"21-15-9",      desc:"Nao pare no fundo. Use o elastic do squat."},
  {id:21, fund:"thruster",   name:"JACKIE",            cat:"Classico",     type:"For Time",           tc:"15min", lvl:"RX",    rx:"Thruster 43/30kg",         scaled:"30/20kg",              icon:"🚣",  moves:["1000m Row","50 Thruster 43/30kg","30 Pull-Up"],                                        reps:"1x",           desc:"Saia da barca sem pausa. Row de aquecimento."},
  {id:22, fund:"thruster",   name:"TRIPLE AMEACA",     cat:"Metcon",       type:"3 Rounds For Time",  tc:"18min", lvl:"RX",    rx:"Thruster 43/30kg",         scaled:"30/20kg",              icon:"💪",  moves:["15 Thruster 43/30kg","15 Box Jump Over 60/50cm","400m Run"],                           reps:"3 rounds",     desc:"Saia com ritmo moderado no 1o round."},
  {id:23, fund:"thruster",   name:"THRUSTER EMOM",     cat:"Halterofilia", type:"EMOM 15min",         tc:"15min", lvl:"RX",    rx:"Thruster 50/35kg",         scaled:"35/25kg",              icon:"🔥",  moves:["EMOM: 5 Thruster - sem parar em nenhum ponto"],                                        reps:"15 rounds",    desc:"75 thrusters em 15min. O dip e seu amigo."},
  // PUSH JERK
  {id:24, fund:"push_jerk",  name:"JERK LADDER",       cat:"Halterofilia", type:"EMOM 12min",         tc:"12min", lvl:"RX",    rx:"Push Jerk 70/47kg",        scaled:"50/35kg",              icon:"⬆️",  moves:["EMOM crescente: 1-1-2-2-3-3-4-4-5-5-6-6 Push Jerk"],                                  reps:"escada",       desc:"Reinicie o dip completamente a cada rep."},
  {id:25, fund:"push_jerk",  name:"PRESS FEST",        cat:"Metcon",       type:"For Time",           tc:"15min", lvl:"RX",    rx:"S2OH 60/43kg + CTB",       scaled:"43/30kg + PU",         icon:"🔝",  moves:["30 S2OH 60/43kg","30 CTB Pull-Up","20 S2OH","20 CTB","10 S2OH","10 CTB"],               reps:"30-20-10",     desc:"Overhead + pulling. Push jerk para cargas altas - economize."},
  // BAR MUSCLE-UP
  {id:26, fund:"bmu",        name:"BMU FLOW",          cat:"Ginastica",    type:"AMRAP 12min",        tc:"12min", lvl:"Elite",  rx:"BMU padrao",               scaled:"CTB Pull-Up",          icon:"🔄",  moves:["3 Bar Muscle-Up","6 Power Clean 60/43kg","9 Box Jump 60cm"],                            reps:"AMRAP 12min",  desc:"Kip limpo, push no topo. Nao pule a transicao."},
  {id:27, fund:"bmu",        name:"GYMNAST GRIND",     cat:"Ginastica",    type:"EMOM 10min",         tc:"10min", lvl:"RX",     rx:"3 BMU ou 5 CTB",           scaled:"5 Pull-Up",            icon:"🤸",  moves:["EMOM: 3 Bar Muscle-Up (RX) ou 5 CTB Pull-Up (Scaled)"],                                reps:"10 rounds",    desc:"Prefira 2 tecnicos a 3 ruins."},
  {id:28, fund:"bmu",        name:"MUSCLE MADNESS",    cat:"Ginastica",    type:"For Time",           tc:"15min", lvl:"Elite",  rx:"CTB + BMU + RMU",          scaled:"PU + CTB",             icon:"💫",  moves:["21 CTB Pull-Up","15 Bar Muscle-Up","9 Ring Muscle-Up"],                                reps:"21-15-9",      desc:"Progressao de ginastica. Respeite cada transicao."},
  // RING MUSCLE-UP
  {id:29, fund:"rmu",        name:"RING CIRCUIT",      cat:"Ginastica",    type:"AMRAP 15min",        tc:"15min", lvl:"Elite",  rx:"Ring MU padrao",           scaled:"CTB + Ring Dip",       icon:"💫",  moves:["3 Ring Muscle-Up","6 OHS 43/30kg","9 TTB"],                                            reps:"AMRAP 15min",  desc:"False grip nos rings e essencial."},
  {id:30, fund:"rmu",        name:"AMANDA",            cat:"Classico",     type:"For Time",           tc:"15min", lvl:"Elite",  rx:"RMU + Squat Snatch 60/43kg",scaled:"CTB + PS 43/30kg",    icon:"⚡",  moves:["9-7-5 Ring Muscle-Up","9-7-5 Squat Snatch 60/43kg"],                                   reps:"9-7-5",        desc:"Snatch no topo do ciclo para descansar bracos."},
  // HSPU
  {id:31, fund:"hspu",       name:"INVERSION PARTY",   cat:"Ginastica",    type:"AMRAP 15min",        tc:"15min", lvl:"RX",     rx:"HSPU kipping",             scaled:"Pike Push-Up em box",  icon:"🤸",  moves:["5 HSPU","10 KB Swing 24/16kg","15 Air Squat"],                                         reps:"AMRAP 15min",  desc:"Lockout completo em cada HSPU."},
  {id:32, fund:"hspu",       name:"OVERHEAD HELL",     cat:"Ginastica",    type:"For Time",           tc:"18min", lvl:"RX",     rx:"HSPU + OHS 43/30kg",       scaled:"Pike PU + OHS 30kg",   icon:"🙆",  moves:["10 HSPU","10 OHS 43/30kg","8 HSPU","8 OHS","6 HSPU","6 OHS","400m Run"],               reps:"decrescente",  desc:"HSPU e OHS testam ombros diferente. Respira na transicao."},
  {id:33, fund:"hspu",       name:"MARY",              cat:"Classico",     type:"AMRAP 20min",        tc:"20min", lvl:"RX",     rx:"HSPU + Pistol + PU",       scaled:"Pike PU + Box Pistol", icon:"🔄",  moves:["5 HSPU","10 Pistol Squat","15 Pull-Up"],                                               reps:"AMRAP 20min",  desc:"Versao avancada da Cindy. Pacing: 10+ rounds e bom."},
  // HANDSTAND WALK
  {id:34, fund:"hs_walk",    name:"WALK THE LINE",     cat:"Ginastica",    type:"AMRAP 15min",        tc:"15min", lvl:"Elite",  rx:"HS Walk 10m",              scaled:"HS Hold 30s na parede",icon:"🙆",  moves:["10m Handstand Walk","10 Power Clean 60/43kg","10 Box Jump 60cm"],                       reps:"AMRAP 15min",  desc:"Empurre o chao, nao equilibre na cabeca."},
  {id:35, fund:"hs_walk",    name:"INVERT CHIPPER",    cat:"Ginastica",    type:"For Time",           tc:"20min", lvl:"Elite",  rx:"HS Walk 30m total",        scaled:"5 Wall Walk",          icon:"🤸",  moves:["15m HS Walk","30 HSPU","30 TTB","30 Box Jump 60cm","15m HS Walk"],                       reps:"chipper",      desc:"Divida distancia em trechos de 5m."},
  // PISTOL SQUAT
  {id:36, fund:"pistol",     name:"UNILATERAL BURN",   cat:"Ginastica",    type:"For Time",           tc:"15min", lvl:"RX",     rx:"Pistol livre",             scaled:"Pistol no box",        icon:"🦵",  moves:["50 Pistol Squat alternado","50 Pull-Up","50 KB Swing 24/16kg"],                         reps:"chipper",      desc:"Heel down o tempo todo."},
  {id:37, fund:"pistol",     name:"SINGLE LEG CIRCUIT",cat:"Ginastica",    type:"AMRAP 12min",        tc:"12min", lvl:"RX",     rx:"Pistol + SL DL 40/25kg",   scaled:"Box Pistol + DL 60kg", icon:"💥",  moves:["10 Pistol Squat (5 cada lado)","10 Single Leg DL 40/25kg","10 Step-Up KB 24/16kg"],     reps:"AMRAP 12min",  desc:"Controle excentrico vale mais que velocidade."},
  // ROPE CLIMB
  {id:38, fund:"rope",       name:"CLIMB & PULL",      cat:"Ginastica",    type:"For Time",           tc:"20min", lvl:"RX",     rx:"Rope Climb 4.5m",          scaled:"Rope Pull sentado",    icon:"🧗",  moves:["5 Rope Climb","25 Deadlift 100/70kg","5 Rope Climb","25 KB Swing 32/24kg","5 Rope Climb","25 Box Jump 60cm"], reps:"chipper", desc:"J-hook economiza 60% dos bracos."},
  {id:39, fund:"rope",       name:"ROPE & ROW",        cat:"Ginastica",    type:"5 Rounds For Time",  tc:"20min", lvl:"RX",     rx:"Rope Climb 4.5m",          scaled:"2 Rope Pull sentado",  icon:"🚣",  moves:["3 Rope Climb","250m Row","12 TTB"],                                                    reps:"5 rounds",     desc:"Remo recupera os bracos entre subidas."},
  {id:40, fund:"rope",       name:"LEGLESS POWER",     cat:"Ginastica",    type:"AMRAP 10min",        tc:"10min", lvl:"Elite",  rx:"Legless Rope Climb",       scaled:"Rope Climb normal",    icon:"⚡",  moves:["2 Legless Rope Climb","10 Power Clean 70/47kg","20 Double Under"],                      reps:"AMRAP 10min",  desc:"Inicia o pull pelos lats, nao so pelo biceps."},
  // TOES TO BAR
  {id:41, fund:"ttb",        name:"TTB COMPLEX",       cat:"Ginastica",    type:"AMRAP 14min",        tc:"14min", lvl:"RX",     rx:"TTB padrao",               scaled:"Knee Raise",           icon:"🎯",  moves:["10 TTB","10 Power Snatch 50/35kg","10 Box Jump 60cm"],                                  reps:"AMRAP 14min",  desc:"Quadril ativa os tres movimentos. Ritmo uniforme."},
  {id:42, fund:"ttb",        name:"CORE WARRIOR",      cat:"Core",         type:"For Time",           tc:"15min", lvl:"RX",     rx:"TTB + DU",                 scaled:"Knee Raise + SU x2",   icon:"💢",  moves:["50 TTB","50 DU","40 TTB","40 DU","30 TTB","30 DU"],                                    reps:"decrescente",  desc:"Sets de 10 TTB desde o inicio - nao force unbroken."},
  {id:43, fund:"ttb",        name:"ANNIE PLUS",        cat:"Classico",     type:"For Time",           tc:"15min", lvl:"RX",     rx:"DU + TTB + C&J 60/43kg",  scaled:"SU + KR + 43/30kg",    icon:"🪢",  moves:["50-40-30-20-10 DU","50-40-30-20-10 TTB","10-8-6-4-2 Clean & Jerk 60/43kg"],            reps:"combinado",    desc:"Volume de DU cansa bracos para o C&J. Respira no TTB."},
  // DOUBLE UNDERS
  {id:44, fund:"du",         name:"SKIP & SQUAT",      cat:"Cardio",       type:"AMRAP 12min",        tc:"12min", lvl:"RX",     rx:"50 DU + 10 Squat Clean",   scaled:"80 SU + 10 PC",        icon:"🏃",  moves:["50 Double Under","10 Squat Clean 60/43kg"],                                            reps:"AMRAP 12min",  desc:"DU como respiracao ativa. Ritmo consistente."},
  {id:45, fund:"du",         name:"ANNIE",             cat:"Classico",     type:"For Time",           tc:"15min", lvl:"RX",     rx:"Double Under",             scaled:"Single Under x2",      icon:"🪢",  moves:["50-40-30-20-10 Double Under","50-40-30-20-10 Sit-Up"],                                  reps:"50-40-30-20-10",desc:"Coordenacao e core. Respire nas transicoes."},
  {id:46, fund:"du",         name:"DU CHIPPER",        cat:"Cardio",       type:"For Time",           tc:"20min", lvl:"RX",     rx:"DU padrao",                scaled:"Single Under x2",      icon:"💥",  moves:["100 DU","50 Wall Ball 9/6kg","75 DU","30 KB Swing 24/16kg","50 DU","15 Pull-Up"],        reps:"chipper",      desc:"100 DU = 10 sets de 10. Nao force o unbroken."},
  // ROWING
  {id:47, fund:"rowing",     name:"ROW POWER",         cat:"Cardio",       type:"For Time",           tc:"20min", lvl:"RX",     rx:"Row + DL 100/70kg",        scaled:"Row + DL 70/47kg",     icon:"🚣",  moves:["500m Row","15 Deadlift 100/70kg","400m Row","12 DL","300m Row","9 DL"],                  reps:"decrescente",  desc:"Mesma mecanica do remo no deadlift."},
  {id:48, fund:"rowing",     name:"2K TEST",           cat:"Benchmark",    type:"For Time",           tc:"10min", lvl:"RX",     rx:"2000m Row",                scaled:"1500m Row",            icon:"🌊",  moves:["2000m Row — pace sustentavel maximo"],                                                 reps:"1x",           desc:"Saida nos primeiros 500m a 95%, sustente nos outros 3."},
  {id:49, fund:"rowing",     name:"PULL PARTY",        cat:"Cardio",       type:"3 Rounds For Time",  tc:"20min", lvl:"RX",     rx:"500m Row + PU + HPC",      scaled:"400m + Ring Row",      icon:"💪",  moves:["500m Row","15 Pull-Up","10 Hang Power Clean 70/47kg","5 BMU"],                           reps:"3 rounds",     desc:"Puxada horizontal + vertical + barbell. Pulling completo."},
  {id:50, fund:"rowing",     name:"REMO INTERVALS",    cat:"Cardio",       type:"EMOM 20min",         tc:"20min", lvl:"RX",     rx:"Cal Row + Thruster",       scaled:"cargas leves",         icon:"⏱️",  moves:["Min 1-2: 15 Cal Row","Min 3-4: 10 Thruster 43/30kg","Min 5: 10 TTB"],                    reps:"EMOM em blocos",desc:"Saia da barca com 30s para o thruster."},
  // RUNNING
  {id:51, fund:"run",        name:"RUN & LIFT",        cat:"Cardio",       type:"5 Rounds For Time",  tc:"25min", lvl:"RX",     rx:"400m Run + BS 80/55kg",    scaled:"400m + BS 60/40kg",    icon:"🏃",  moves:["400m Run","10 Back Squat 80/55kg","10 Box Jump 60cm"],                                  reps:"5 rounds",     desc:"Legs day dobrado. Saia devagar no 1o round."},
  {id:52, fund:"run",        name:"TEMPO COMPLEX",     cat:"Cardio",       type:"For Time",           tc:"30min", lvl:"RX",     rx:"800m Run + Barbell",       scaled:"Run reduzido",         icon:"⚡",  moves:["800m Run","21 Clean 60/43kg","800m Run","15 Thruster 60/43kg","800m Run","9 S2OH 60/43kg"],reps:"alternado",    desc:"Corrida a 80%, barbell crescente em dificuldade."},
  {id:53, fund:"run",        name:"HELEN",             cat:"Classico",     type:"3 Rounds For Time",  tc:"15min", lvl:"RX",     rx:"KB 24/16kg",               scaled:"KB 16/12kg + Ring Row",icon:"🔥",  moves:["400m Run","21 KB Swing 24/16kg","12 Pull-Up"],                                          reps:"3 rounds",     desc:"KB Swing unbroken. Administre o Pull-Up."},
  // ASSAULT BIKE
  {id:54, fund:"assault",    name:"BIKE & BARBELL",    cat:"Cardio",       type:"AMRAP 15min",        tc:"15min", lvl:"RX",     rx:"15cal AB + Barbell",       scaled:"10cal + cargas leves", icon:"🚴",  moves:["15 Cal Assault Bike","10 Thruster 43/30kg","5 BMU ou 8 CTB"],                           reps:"AMRAP 15min",  desc:"Cadencia alta na bike, nao ritmo pesado."},
  {id:55, fund:"assault",    name:"SPRINT EMOM",       cat:"Cardio",       type:"EMOM 10min",         tc:"10min", lvl:"RX",     rx:"10 Cal Assault Bike",      scaled:"8 Cal",                icon:"💥",  moves:["EMOM: 10 Cal Assault Bike - sprint maximo"],                                           reps:"10 rounds",    desc:"Meta: 10cal em menos de 30s. Use os bracos, nao so as pernas."},
  {id:56, fund:"assault",    name:"ECHO FURY",         cat:"Cardio",       type:"For Time",           tc:"15min", lvl:"RX",     rx:"Echo Bike ou Assault Bike",scaled:"Cal reduzidas",         icon:"🔥",  moves:["50 Cal Bike","50 Wall Ball 9/6kg","30 Cal Bike","30 KB Swing 24/16kg","10 Cal Bike","10 BMU"],reps:"decrescente", desc:"Bike ancora o ritmo. Volume decresce, dificuldade cresce."},
  // METCONS GERAIS
  {id:57, fund:"geral",      name:"FIGHT GONE BAD",    cat:"Metcon",       type:"3x5min (1min rest)", tc:"17min", lvl:"RX",     rx:"35/26kg padrao",           scaled:"menor carga",          icon:"🥊",  moves:["1min Wall Ball 9/6kg","1min SDLHP 35/26kg","1min Box Jump 60/50cm","1min Push Press 35/26kg","1min Cal Row","1min rest"],reps:"3 rounds",desc:"Score = total de reps. Distribua esforco igual nos 5 movimentos."},
  {id:58, fund:"geral",      name:"FILTHY FIFTY",      cat:"Chipper",      type:"For Time",           tc:"30min", lvl:"RX",     rx:"pesos padrao",             scaled:"reduzido",             icon:"💀",  moves:["50 Box Jump 60cm","50 Jump Pull-Up","50 KB Swing 16kg","50 Walking Lunge","50 KTE","50 Push Press 20kg","50 Back Ext","50 WB 9/6kg","50 Burpee","50 DU"],reps:"chipper 50s",desc:"Divida tudo em sets de 10 desde o inicio."},
  {id:59, fund:"geral",      name:"NATE",              cat:"Classico",     type:"AMRAP 20min",        tc:"20min", lvl:"Elite",  rx:"MU padrao",                scaled:"CTB + Ring Dip",       icon:"🎯",  moves:["2 Muscle-Up","4 HSPU","8 KB Swing 32/24kg"],                                           reps:"AMRAP 20min",  desc:"10+ rounds e excelente. Pacing uniforme os 20min."},
  {id:60, fund:"geral",      name:"CINDY",             cat:"Classico",     type:"AMRAP 20min",        tc:"20min", lvl:"RX",     rx:"padrao",                   scaled:"Ring Row + Knee PU",   icon:"🔄",  moves:["5 Pull-Up","10 Push-Up","15 Air Squat"],                                               reps:"AMRAP 20min",  desc:"Nunca va a falha. Quebre cedo para manter cadencia."},
  {id:61, fund:"geral",      name:"BARBARA",           cat:"Classico",     type:"5 Rounds For Time",  tc:"30min", lvl:"RX",     rx:"padrao",                   scaled:"reducao de reps",      icon:"🔥",  moves:["20 Pull-Up","30 Push-Up","40 Sit-Up","50 Air Squat","3min Rest"],                        reps:"5 rounds",     desc:"Gerencie sets desde o round 1."},
  {id:62, fund:"geral",      name:"KAREN",             cat:"Classico",     type:"For Time",           tc:"15min", lvl:"RX",     rx:"Wall Ball 9/6kg",          scaled:"6/4kg, alvo mais baixo",icon:"🎯", moves:["150 Wall Ball 9/6kg"],                                                                 reps:"150 reps",     desc:"Sets de 15 do inicio. Nao deixe a bola cair."},
  {id:63, fund:"geral",      name:"MURPH",             cat:"Hero WOD",     type:"For Time",           tc:"60min", lvl:"RX",     rx:"com colete 9/6kg",         scaled:"sem colete",           icon:"🎖️", moves:["1 Mile Run","100 Pull-Up","200 Push-Up","300 Air Squat","1 Mile Run"],                    reps:"1x",           desc:"Particionar: 20 rounds de 5 Pull-Up + 10 PU + 15 Squat."},
  {id:64, fund:"geral",      name:"ELIZABETH",         cat:"Classico",     type:"For Time",           tc:"15min", lvl:"RX",     rx:"Squat Clean 61/43kg",      scaled:"43/30kg + Band",       icon:"💫",  moves:["21-15-9 Squat Clean 61/43kg","21-15-9 Ring Dip"],                                      reps:"21-15-9",      desc:"Ring dip: cotovelos levemente virados para dentro."},
  {id:65, fund:"geral",      name:"JACOB'S LADDER",    cat:"Metcon",       type:"For Time",           tc:"20min", lvl:"RX",     rx:"PC 60/43kg, BJ 60cm",      scaled:"43/30kg, 50cm",        icon:"🪜",  moves:["1-2-3-4-5-6-7-8-9-10 Power Clean 60/43kg","10-9-8-7-6-5-4-3-2-1 Box Jump Over 60cm"],   reps:"escada dupla", desc:"Clean fica mais pesado quando BJ cansa as pernas."},
  {id:66, fund:"geral",      name:"RUNNING DIANE",     cat:"Metcon",       type:"For Time",           tc:"18min", lvl:"RX",     rx:"DL 102/70kg + HSPU",       scaled:"70/47kg + Pike PU",    icon:"💥",  moves:["400m Run","21 DL + 21 HSPU","400m Run","15 DL + 15 HSPU","400m Run","9 DL + 9 HSPU"],    reps:"corrida + 21-15-9",desc:"Corrida e o desafio mental. Nao desacelere."},
  {id:67, fund:"geral",      name:"BASELINE",          cat:"Benchmark",    type:"For Time",           tc:"10min", lvl:"RX",     rx:"padrao",                   scaled:"Ring Row",             icon:"📊",  moves:["500m Row","40 Air Squat","30 Sit-Up","20 Push-Up","10 Pull-Up"],                         reps:"1x",           desc:"Anote o tempo e repita em 3 meses. Evolucao mensuravel."},
  // EQUIPE
  {id:68, fund:"geral",      name:"PARTNER CARRY",     cat:"Time",         type:"For Time (Dupla)",   tc:"20min", lvl:"RX",     rx:"dividir reps",             scaled:"idem",                 icon:"👥",  moves:["50 Cal Row alternado","40 Thruster 43/30kg","30 Pull-Up","20 Box Jump","10 BMU ou 20 CTB"],reps:"dividido",     desc:"Nao deixe o parceiro parado mais de 20s."},
  {id:69, fund:"geral",      name:"BACK TO BACK",      cat:"Time",         type:"AMRAP 20min (Dupla)",tc:"20min", lvl:"RX",     rx:"alternado",                scaled:"cargas leves",         icon:"🔗",  moves:["A: 5 PC 60/43kg + B: 5 HSPU","A: 10 BJ + B: 10 KB Swing (simultaneo)"],                reps:"AMRAP 20min",  desc:"Nunca pare os dois ao mesmo tempo."},
  // FORCA AUXILIAR
  {id:70, fund:"geral",      name:"STRICT STRENGTH",   cat:"Forca",        type:"EMOM 16min",         tc:"16min", lvl:"RX",     rx:"peso desafiador",          scaled:"60% 1RM",              icon:"💪",  moves:["Min1: 5 Strict Pull-Up","Min2: 5 Strict HSPU","Min3: 10 GHD Sit-Up","Min4: 10 Back Ext"],reps:"EMOM 16min",   desc:"Zero momentum. Forca estrita e o fundamento."},
  {id:71, fund:"geral",      name:"POSTERIOR CHAIN",   cat:"Forca",        type:"3 Rounds",           tc:"18min", lvl:"RX",     rx:"peso moderado",            scaled:"leve",                 icon:"🔙",  moves:["8 Romanian DL pesado","8 Good Morning","8 Back Ext ou GHD","8 Single Leg DL cada lado"], reps:"3 rounds",     desc:"Posterior e o motor do CrossFit. Invista nele."},
  {id:72, fund:"geral",      name:"PRESSING POWER",    cat:"Forca",        type:"4 Rounds",           tc:"16min", lvl:"RX",     rx:"peso desafiador",          scaled:"leve",                 icon:"⬆️",  moves:["5 Strict Press + 5 Push Press + 5 Push Jerk (mesma barra)"],                            reps:"4 rounds",     desc:"Forca + explosao progressiva sem largar a barra."},
  // WODs CURTOS
  {id:73, fund:"geral",      name:"SPRINT LADDER",     cat:"Metcon",       type:"For Time",           tc:"8min",  lvl:"Scaled", rx:"Thruster 30/20kg",         scaled:"sem carga",            icon:"⚡",  moves:["10-8-6-4-2 Thruster 30/20kg","2-4-6-8-10 Pull-Up"],                                    reps:"escada inversa",desc:"WOD de 8min. Alta intensidade, baixo volume."},
  {id:74, fund:"geral",      name:"THE MINUTE",        cat:"Metcon",       type:"EMOM 10min",         tc:"10min", lvl:"RX",     rx:"padrao",                   scaled:"reduzido",             icon:"⏱️",  moves:["Min impar: 10 KB Swing 24/16kg + 5 Pull-Up","Min par: 10 Push-Up + 10 Sit-Up"],          reps:"EMOM 10min",   desc:"50 reps de cada movimento em 10 minutos."},
  // WODs LONGOS
  {id:75, fund:"geral",      name:"THE LONG GAME",     cat:"Endurance",    type:"For Time",           tc:"45min", lvl:"RX",     rx:"volume alto",              scaled:"60% volume",           icon:"🌊",  moves:["800m Run","30 DL 80/55kg","800m Run","30 Thruster 50/35kg","800m Run","30 Pull-Up","800m Run"],reps:"alternado",  desc:"Nao e prova de velocidade. 3.2km + 90 reps de barbell."},
  {id:76, fund:"geral",      name:"TOUR DE FORCE",     cat:"Endurance",    type:"AMRAP 30min",        tc:"30min", lvl:"RX",     rx:"pesos moderados",          scaled:"pesos leves",          icon:"🏆",  moves:["500m Row","10 Power Clean 60/43kg","10 HSPU","10 Box Jump 60cm"],                        reps:"AMRAP 30min",  desc:"Saia no ritmo de 10 rounds e ajuste conforme."},
  // COMPETICAO
  {id:77, fund:"geral",      name:"QUALIFIER SIM",     cat:"Competicao",   type:"For Time",           tc:"20min", lvl:"Elite",  rx:"cargas de competicao",     scaled:"RX reduzido",          icon:"🥇",  moves:["30 Cal Assault Bike","25 Thruster 50/35kg","20 CTB Pull-Up","15 Squat Clean 80/55kg","10 Bar MU","5 Squat Snatch 80/55kg"],reps:"chipper",desc:"Gerencie a transicao entre movimentos."},
  {id:78, fund:"geral",      name:"SPRINT FINAL",      cat:"Competicao",   type:"AMRAP 8min",         tc:"8min",  lvl:"Elite",  rx:"cargas de games",          scaled:"RX padrao",            icon:"⚡",  moves:["10 S2OH 80/55kg + 10 BMU + 10 OHS 80/55kg por round"],                                 reps:"max rounds 8min",desc:"Tudo num sprint de 8min. Estrategia antes de entrar."},
  // INICIANTES
  {id:79, fund:"geral",      name:"PRIMEIRO DIA",      cat:"Iniciante",    type:"AMRAP 12min",        tc:"12min", lvl:"Amador", rx:"N/A",                      scaled:"sem carga",            icon:"🌱",  moves:["10 Air Squat","10 Push-Up","10 Sit-Up","200m Trote"],                                   reps:"AMRAP 12min",  desc:"Postura antes de velocidade. O primeiro WOD de qualquer atleta."},
  {id:80, fund:"geral",      name:"BASIC BLAST",       cat:"Iniciante",    type:"3 Rounds For Time",  tc:"15min", lvl:"Amador", rx:"KB 16/12kg",               scaled:"KB 8/6kg",             icon:"🌟",  moves:["15 Goblet Squat KB","15 Ring Row","15 KB Swing","200m Run"],                            reps:"3 rounds",     desc:"Form first, speed never."},
  // MOBILIDADE
  {id:81, fund:"geral",      name:"COOL DOWN WORK",    cat:"Acessorio",    type:"3 Rounds",           tc:"12min", lvl:"Amador", rx:"sem carga",                scaled:"idem",                 icon:"🧘",  moves:["30s Pigeon Pose cada lado","30s Shoulder Stretch na barra","30s Hip Flexor","10 Cat-Cow","10 Thoracic Rotation"],reps:"3 rounds",desc:"Fundamental para longevidade no CrossFit."},
  // CLASSIC OPEN STYLE
  {id:82, fund:"geral",      name:"OPEN 19.1",         cat:"Open Style",   type:"AMRAP 15min",        tc:"15min", lvl:"RX",     rx:"Wall Ball 9/6kg",          scaled:"6/4kg, alvo menor",    icon:"🏆",  moves:["19 Wall Ball 9/6kg","19 Cal Row"],                                                     reps:"AMRAP 15min",  desc:"Score bom: 7+ rounds. Ritmo de remo e o x-factor."},
  {id:83, fund:"geral",      name:"OPEN 20.1",         cat:"Open Style",   type:"AMRAP 10min",        tc:"10min", lvl:"RX",     rx:"G2OH 43/29kg",             scaled:"29/20kg",              icon:"⚡",  moves:["8 Ground to Overhead 43/29kg","10 Bar Facing Burpee"],                                  reps:"AMRAP 10min",  desc:"5+ rounds e competitivo. Ciclar a barra e o desafio."},
  {id:84, fund:"geral",      name:"OPEN 22.1",         cat:"Open Style",   type:"AMRAP 15min",        tc:"15min", lvl:"RX",     rx:"DB 22.5/15kg, BJ 60/50cm", scaled:"DB 15/10kg, 50cm",     icon:"🔄",  moves:["3 Wall Walk","12 DB Snatch 22.5/15kg alternado","15 Box Jump Over 60/50cm"],            reps:"AMRAP 15min",  desc:"Wall Walk: 5+ rounds excelente. Gerencie os ombros."},
  // KETTLEBELL
  {id:85, fund:"geral",      name:"KB HELL",           cat:"Kettlebell",   type:"Chipper",            tc:"20min", lvl:"RX",     rx:"KB 32/24kg",               scaled:"24/16kg",              icon:"🔔",  moves:["50 KB Swing","40 Goblet Squat","30 KB Clean & Press","20 Turkish Get-Up"],               reps:"chipper",      desc:"TGU e o movimento mais completo do fitness."},
  {id:86, fund:"geral",      name:"TABATA TOTAL",      cat:"Metcon",       type:"Tabata (32min)",     tc:"32min", lvl:"Scaled", rx:"cargas moderadas",         scaled:"sem carga",            icon:"⏰",  moves:["Tabata Air Squat","Tabata Push-Up","Tabata Sit-Up","Tabata Pull-Up"],                    reps:"4x Tabata",    desc:"Score = soma dos menores rounds de cada movimento."},
  // EXTRA
  {id:87, fund:"geral",      name:"THE 7",             cat:"Hero WOD",     type:"7 Rounds For Time",  tc:"35min", lvl:"RX",     rx:"padrao",                   scaled:"cargas reduzidas",     icon:"🎖️", moves:["7 HSPU","7 Thruster 50/35kg","7 Knee to Elbow","7 DL 110/75kg","7 Burpee","7 KB Swing 32/24kg","7 Pull-Up"],reps:"7 rounds",desc:"7 movimentos por round. Gerenciar o total de 49 reps."},
  {id:88, fund:"geral",      name:"GRACE",             cat:"Classico",     type:"For Time",           tc:"10min", lvl:"RX",     rx:"Clean & Jerk 60/43kg",     scaled:"43/30kg",              icon:"🏋️", moves:["30 Clean & Jerk"],                                                                     reps:"30 reps",      desc:"Sub-3min e elite. Sub-5min e muito bom. Estrategia de cycling."},
,

  // ── SEMANA REAL — Coach L4 (programacao enviada) ──────────────
  {id:89,  fund:"snatch",    name:"PARTNER FRAN SNATCH",  cat:"Classico",     type:"For Time 15min (Dupla)", tc:"15min", lvl:"RX",
   rx:"Thruster 44/29kg",   scaled:"30/19kg",   icon:"⚡",
   moves:["42-30-18 Thruster (revezando)","42-30-18 Pull-Up / Box Jump Pull-Up / Swing Americano","Cash out: 150 SU ou 75 DU por atleta"],
   reps:"42-30-18",
   desc:"Partner Fran. Revezam reps. Cash out individual no final. Snatch cycle no aquecimento.",
   tip:"Dividam sets estrategicamente desde o inicio. Nao deixem a barra cair nas series de 42."},

  {id:90,  fund:"back_squat",name:"AMRAP DEADLIFT POWER",  cat:"Metcon",       type:"AMRAP 12min",            tc:"12min", lvl:"RX",
   rx:"Deadlift 80/55kg",   scaled:"60/35kg",   icon:"🔥",
   moves:["10 Deadlift 80/55kg","8 Push-Up (HSPU avancado)","5 Burpee Box Jump","50m Run"],
   reps:"AMRAP 12min",
   desc:"Round validado ao entrar na corrida. Maximo de rounds possiveis. Back Squat 5-5-4-4-3-2-1 no bloco de forca.",
   tip:"O round so conta ao completar a corrida. Gerencie a corrida para nao travar no DL."},

  {id:91,  fund:"bmu",       name:"GYMNASTICS PYRAMID",   cat:"Ginastica",     type:"Piramide Skill",         tc:"20min", lvl:"RX",
   rx:"1-2-3-4-5-4-3-2-1 Bar Muscle-Up", scaled:"2-4-6-8-6-4-2 CTB Pull-Up", icon:"🔄",
   moves:["Avancado: 1-2-3-4-5-4-3-2-1 Bar Muscle-Up","Intermediario: 2-4-6-8-6-4-2 CTB ou Pull-Up","Iniciante: 10-15-20-15-10 Kipping ou Swing Americano","A cada rodada: 20 DU ou SU"],
   reps:"piramide",
   desc:"Eficiencia ginastica em piramide. Cada rodada intercalada com DU. EMOM Forca: 5 Power Clean + 5 S2OH + 12 Wall Ball em 15min.",
   tip:"Escolha a versao do seu nivel. Mantenha qualidade de movimento na descida da piramide."},

  {id:92,  fund:"rope",      name:"ROPE CLIMB EMOM",      cat:"Ginastica",     type:"EMOM 10min + E3MOM 15min",tc:"25min", lvl:"RX",
   rx:"1 Legless Rope Climb", scaled:"1 Rope Climb padrao", icon:"🧗",
   moves:["EMOM 10min: 1 Subida de corda + 8 DB Snatch","Legless (avancado) / Padrao / Adotado (iniciante)","E3MOM 5x: 12 TTB + 9 Hang Power Clean + 6 Devil Press"],
   reps:"EMOM 10min + E3MOM 5x",
   desc:"Tecnica de subida de corda com foco em eficiencia. Depois: complexo de potencia a cada 3 minutos.",
   tip:"J-hook perfeito economiza 60% dos bracos. No E3MOM: gerencie o Devil Press — e o mais pesado."},

  {id:93,  fund:"clean",     name:"CLEAN COMPLEX 1RM",    cat:"Halterofilia",  type:"Cap 10min + For Time 21min",tc:"31min",lvl:"RX",
   rx:"Rx: 80/45kg + DB 22.5/15kg", scaled:"60/35kg + 12/10kg", icon:"🏋️",
   moves:["Skill: 1 Clean + 1 Hang Clean + 1 Front Squat + 1 Jerk (1RM em 10min)","WOD Dupla 3 Rounds: 20 DB S2OH (parceiro faz Barbell OH Hold)","20 Wall Ball + 20 Pull-Up + 20 Power Clean + 100m Run"],
   reps:"3 rounds dupla",
   desc:"Clean complex para 1RM + WOD em dupla com OH Hold. Sexta pesada. Cargas: Rx 80/45kg barbell, 22.5/15kg DB.",
   tip:"No OH Hold: o parceiro deve manter a barra overhead enquanto voce trabalha. Comuniquem a troca."},

  // WODs extras para completar 100+
  {id:94,  fund:"thruster",  name:"TABATA COMPLEX",       cat:"Metcon",        type:"Tabata 8min",            tc:"8min",  lvl:"Scaled",
   rx:"cargas moderadas",   scaled:"sem carga",  icon:"⏱️",
   moves:["Tabata: SU ou DU ou Jumping Jacks","Tabata: Goblet Front Squat","Tabata: Back Barbell Good Morning","Tabata: Plank Hold"],
   reps:"4x Tabata",
   desc:"Warm-up estilo Tabata para dias de Back Squat. Ativa todo o posterior e core.",
   tip:"Tabata = 20s ON 10s OFF 8 rounds. O Good Morning e para ativar o posterior do quadril."},

  {id:95,  fund:"deadlift",  name:"DB BRIDGE CIRCUIT",    cat:"Metcon",        type:"3 Rounds",               tc:"12min", lvl:"Scaled",
   rx:"DB ou KB moderado",  scaled:"sem carga",  icon:"🔔",
   moves:["12 DB/KB Bridge Pull","12 Squat Jump","50m Run"],
   reps:"3 rounds",
   desc:"Warm-up para dias de Rope Climb e Deadlift. Ativa posterior e prepara para carga.",
   tip:"Bridge Pull: deite no chao, joelhos dobrados, puxe o DB verticalmente ativando escapulas."},

  {id:96,  fund:"snatch",    name:"SNATCH CYCLE EMOM",    cat:"Halterofilia",  type:"EMOM 1'15 x 7 Rounds",   tc:"9min",  lvl:"RX",
   rx:"Carga progressiva",  scaled:"60% 1RM",    icon:"⚡",
   moves:["A cada 1'15 por 7 rounds: 1 Snatch + 1 Hang Snatch","Progressao de cargas a cada round"],
   reps:"7 rounds",
   desc:"Snatch cycle tecnico com progressao. Use a cada 1'15 para ter tempo de ajustar carga.",
   tip:"Comece em 60-65% e progrida so se a tecnica estiver perfeita. Qualidade acima de carga."},

  {id:97,  fund:"ttb",       name:"E3MOM TRIPLET",        cat:"Metcon",        type:"Every 3min x 5",         tc:"15min", lvl:"RX",
   rx:"HPC 70/45kg, DP 22.5/15kg", scaled:"50/29kg, 12/8kg", icon:"🎯",
   moves:["Every 3min x 5 rounds:","12 Toes to Bar","9 Hang Power Clean 70/45kg","6 Devil Press 22.5/15kg"],
   reps:"5 rounds",
   desc:"Complexo de forca a cada 3 minutos. TTB + potencia de quadril + press. Cargas Rx: 70/45kg e 22.5/15kg.",
   tip:"O descanso e o tempo restante do intervalo. Se nao terminar em 2min, reduza a carga."},

  {id:98,  fund:"clean",     name:"WARM UP SNATCH",       cat:"Acessorio",     type:"3 Rounds Warm-Up",       tc:"10min", lvl:"Amador",
   rx:"DB ou KB leve",      scaled:"sem carga",  icon:"🌡️",
   moves:["30 Climbers","5/5 Hang DB ou KB Snatch","50 Single Under ou 25 Double Under"],
   reps:"3 rounds",
   desc:"Aquecimento especifico para dias de snatch. Ativa core, quadril e prep. para snatch.",
   tip:"Climbers: joelhos ao peito alternando rapido. DB Snatch: cotovelo alto na puxada."},

  {id:99,  fund:"back_squat",name:"TABATA SQUAT PREP",    cat:"Acessorio",     type:"Tabata Warm-Up",         tc:"8min",  lvl:"Amador",
   rx:"barra vazia",        scaled:"sem carga",  icon:"🌡️",
   moves:["Tabata: SU ou DU ou Jumping Jacks","Tabata: Goblet Front Squat","Tabata: Back Barbell Good Morning","Tabata: Plank Hold"],
   reps:"Tabata",
   desc:"Ativacao completa para dias de Back Squat. Mobilidade e forca de quadril.",
   tip:"Good Morning: joelhos levemente flexionados, quadril para tras, barra no trapezio."},

  {id:100, fund:"bmu",       name:"BODY EXT CIRCUIT",     cat:"Acessorio",     type:"3 Rounds Warm-Up",       tc:"8min",  lvl:"Amador",
   rx:"KB leve",            scaled:"sem carga",  icon:"🌡️",
   moves:["20s Body Extension Hold","10 Swing Russo","20 Shoulder Taps","10 Abs V-Up"],
   reps:"3 rounds",
   desc:"Warm-up para dias de ginastica (BMU, CTB). Ativa posterior, escapulas e core.",
   tip:"Body Ext Hold: barriga no chao, braco e pernas elevados simultaneamente. Mantenha 20s."}
];

// ═══════════════════════════════════════════════════════════════
// OPEN WODs 2015-2024
// ═══════════════════════════════════════════════════════════════
const OPEN_WODS = [
  {year:2024,num:"24.1",type:"AMRAP 15min",      rx:"DB 22.5/15kg",              scaled:"DB 15/10kg, Stepping Lunge",  desc:"3 L Sit-Up / 3 DB Snatch 22.5/15kg / 3 Jumping Lunge — +3 reps a cada round",icon:"🔄"},
  {year:2024,num:"24.2",type:"For Time",          rx:"Box 60/50cm, Burpee BJO",   scaled:"Box 50cm, Step Over",         desc:"1km Row / 50 Burpee Box Jump Over 60/50cm / 1km Row",icon:"🚣"},
  {year:2024,num:"24.3",type:"For Time TC 15min", rx:"DL 102/70kg, DU",           scaled:"DL 70/47kg, SU x2",           desc:"10-8-6-4-2 Deadlift 102/70kg + 50 Double Under entre cada set",icon:"💀"},
  {year:2023,num:"23.1",type:"AMRAP 14min",       rx:"pesos padrao",              scaled:"versao adaptada",             desc:"60 Cal Row / 50 Thruster 20/15kg / 40 Pull-Up / 30 HSPU / 20 Power Clean 61/43kg / 10 BMU",icon:"⚡"},
  {year:2023,num:"23.2A",type:"1RM Snatch 5min",  rx:"Snatch padrao",             scaled:"Power Snatch",                desc:"1 Rep Max Snatch em 5 minutos",icon:"🏋️"},
  {year:2023,num:"23.2B",type:"AMRAP 7min",       rx:"Legless Rope Climb",        scaled:"Rope Climb c/ perna",         desc:"5 Legless Rope Climb 4.5m / 10 Front Squat 61/43kg do chao",icon:"🧗"},
  {year:2023,num:"23.3",type:"For Time TC 7min",  rx:"Legless, OHS 43/30kg",      scaled:"Com pernas, OHS 30/20kg",     desc:"200m Run / 6 Legless Rope Climb / 200m Run / 18 OHS / 200m Run / 6 Legless / 200m Run",icon:"🏃"},
  {year:2022,num:"22.1",type:"AMRAP 15min",       rx:"Wall Walk, DB 22.5/15kg",   scaled:"Inchworm + Push-Up",          desc:"3 Wall Walk / 12 DB Snatch 22.5/15kg / 15 Box Jump Over 60/50cm",icon:"🔥"},
  {year:2022,num:"22.2",type:"1RM S2OH + AMRAP",  rx:"padrao",                    scaled:"adaptado",                    desc:"Build to 1RM S2OH em 5min / AMRAP 4min: 3 Wall Walk + 3 Ring MU + 10 DL 102/70kg",icon:"⬆️"},
  {year:2022,num:"22.3",type:"For Time TC 20min", rx:"BMU e Ring MU",             scaled:"Pull-Up, CTB",                desc:"21-15-9: Thruster 43/30kg + CTB / Thruster + BMU / Thruster + Ring MU",icon:"💪"},
  {year:2021,num:"21.1",type:"AMRAP 15min",       rx:"Wall Walk, DB 22.5/15kg",   scaled:"Inchworm + Push-Up",          desc:"1 Wall Walk / 10 DB Snatch 22.5/15kg / 12 Box Jump Over 60/50cm",icon:"🔄"},
  {year:2021,num:"21.2",type:"TC 20min",          rx:"Squat Snatch pesado",       scaled:"Power Snatch reduzido",       desc:"95 DU + 5 SS 43kg / 85 DU + 5 SS 61kg / 75 DU + 5 SS 70kg / 65 DU + 5 SS 84kg / 55 DU + 5 SS 102kg",icon:"🏋️"},
  {year:2021,num:"21.3/4",type:"For Time",        rx:"GHD, pesado",               scaled:"Sit-Up, reduzido",            desc:"600m Run / 30 GHD Sit-Up / 10 Clean & Jerk 84/56kg / depois 1RM C&J em 5min",icon:"🎯"},
  {year:2020,num:"20.1",type:"AMRAP 10min",       rx:"43/29kg",                   scaled:"29/20kg",                     desc:"8 Ground to Overhead 43/29kg / 10 Bar Facing Burpee",icon:"🔥"},
  {year:2020,num:"20.2",type:"AMRAP 20min",       rx:"DB 22.5/15kg",              scaled:"Knee Raise, Single Under",    desc:"4 DB Thruster 22.5/15kg / 6 TTB / 24 Double Under",icon:"⏱️"},
  {year:2020,num:"20.3",type:"For Time TC 9min",  rx:"Strict HSPU",               scaled:"HSPU kipping",                desc:"21-15-9: DL 102/61kg + Strict HSPU / 21-15-9: DL 143/84kg + Deficit HSPU 10cm",icon:"💪"},
  {year:2020,num:"20.4",type:"For Time TC 30min", rx:"Ring MU",                   scaled:"Jumping MU",                  desc:"30-20-10: Box Jump 60/50cm + Clean 61/43kg + Muscle-Up",icon:"🔄"},
  {year:2020,num:"20.5",type:"AMRAP 7min",        rx:"CTB Pull-Up",               scaled:"Pull-Up kipping",             desc:"Thrusters 43/29kg + CTB Pull-Up escada 7-7-6-7-7-7...",icon:"⚡"},
  {year:2019,num:"19.1",type:"AMRAP 15min",       rx:"Wall Ball 9/6kg",           scaled:"6/4kg, alvo menor",           desc:"19 Wall Ball 9/6kg / 19 Cal Row",icon:"🎯"},
  {year:2019,num:"19.2",type:"TC 25min",          rx:"pesos padrao",              scaled:"Knee Raise, SU x2",           desc:"AMRAP 8min: 25 TTB + 50 DU + 15 Squat Clean 61/43kg — 8min rest — repetir",icon:"🔄"},
  {year:2019,num:"19.3",type:"For Time TC 10min", rx:"Strict HSPU",               scaled:"Pike Push-Up",                desc:"200m OHS 43/29kg / 50 Strict HSPU / 200m Front Rack Lunge 61/43kg",icon:"🤸"},
  {year:2019,num:"19.4",type:"3 Rounds TC 12min", rx:"BMU",                       scaled:"CTB, Step Over",              desc:"3 BMU / 6 DB Clean & Jerk 22.5/15kg / 12 Burpee Box Jump Over 60/50cm",icon:"⚡"},
  {year:2019,num:"19.5",type:"33-27-21-15-9",     rx:"CTB Pull-Up",               scaled:"Pull-Up kipping",             desc:"Thruster 43/29kg / CTB Pull-Up",icon:"💥"},
  {year:2018,num:"18.1",type:"AMRAP 20min",       rx:"padrao",                    scaled:"Knee Raise",                  desc:"8 TTB / 10 DB Hang C&J 22.5/15kg / 14 Cal Row (M) / 12 Cal Row (F)",icon:"🚣"},
  {year:2018,num:"18.2",type:"1RM Clean + AMRAP", rx:"1RM Clean",                 scaled:"adaptado",                    desc:"Build 1RM Clean em 12min / AMRAP 4min: Squat Clean 61/43kg + Bar Facing Burpee",icon:"🏋️"},
  {year:2018,num:"18.3",type:"AMRAP 14min",       rx:"RMU e BMU",                 scaled:"SU adaptado",                 desc:"100 DU / 20 OHS 43/29kg / 100 DU / 12 Ring MU / 100 DU / 20 DB Snatch / 100 DU / 12 Bar MU",icon:"💫"},
  {year:2018,num:"18.4",type:"For Time TC 9min",  rx:"Deficit HSPU",              scaled:"Kipping HSPU",                desc:"21-15-9: DL 102/70kg + HSPU / depois 21-15-9: DL 143/84kg + Deficit HSPU 10cm",icon:"💪"},
  {year:2018,num:"18.5",type:"AMRAP 7min",        rx:"CTB Pull-Up",               scaled:"Pull-Up kipping",             desc:"3-6-9-12... Thruster 43/29kg + CTB Pull-Up",icon:"🔥"},
  {year:2017,num:"17.1",type:"AMRAP 20min",       rx:"DB 22.5/15kg",              scaled:"DB 15/10kg",                  desc:"10 DB Snatch alternado / 15 Box Jump Over 60/50cm",icon:"⚡"},
  {year:2017,num:"17.2",type:"AMRAP 12min",       rx:"Legless Rope Climb",        scaled:"Com pernas",                  desc:"2 Rounds: 50ft Lunge + 16 TTB + 8 DB Clean / Legless Rope Climb",icon:"🧗"},
  {year:2017,num:"17.3",type:"AMRAP 8min",        rx:"Chest-to-Bar",              scaled:"Pull-Up kipping",             desc:"6 CTB / 6 Squat Snatch 43/30kg / escalando peso e reps...",icon:"🏋️"},
  {year:2017,num:"17.4",type:"For Time TC 13min", rx:"DL 102/70kg",               scaled:"DL 70/47kg",                  desc:"55 DL / 55 Wall Ball 9/6kg / 55 Cal Row / 55 HSPU",icon:"💪"},
  {year:2017,num:"17.5",type:"AMRAP 40min",       rx:"Thruster 43/30kg",          scaled:"Thruster 30/20kg",            desc:"10 rounds: 9 Thruster + 35 DU",icon:"🔄"},
  {year:2016,num:"16.1",type:"AMRAP 20min",       rx:"55lb OHS",                  scaled:"35lb OHS",                    desc:"25ft Overhead Walking Lunge / 8 Burpee Box Jump 60/50cm / 25ft OHS / 8 CTB",icon:"🏃"},
  {year:2016,num:"16.2",type:"TC 20min",          rx:"padrao",                    scaled:"adaptado",                    desc:"25 TTB + 50 DU + 15 Squat Clean 54/38kg / escalando peso e reps...",icon:"🎯"},
  {year:2016,num:"16.3",type:"AMRAP 7min",        rx:"Bar Muscle-Up",             scaled:"CTB Pull-Up",                 desc:"10 Power Snatch 35/25kg / 3 Bar Muscle-Up",icon:"⚡"},
  {year:2016,num:"16.4",type:"AMRAP 13min",       rx:"padrao",                    scaled:"adaptado",                    desc:"55 DL 102/70kg / 55 Wall Ball 9/6kg / 55 Cal Row / 55 HSPU",icon:"🔥"},
  {year:2016,num:"16.5",type:"For Time",          rx:"Thruster 43/30kg",          scaled:"30/20kg",                     desc:"21-18-15-12-9-6-3: Thruster + Bar Facing Burpee",icon:"💥"},
  {year:2015,num:"15.1",type:"AMRAP 9min",        rx:"padrao",                    scaled:"adaptado",                    desc:"15 TTB / 10 DL 102/70kg / 5 Squat Clean 102/70kg",icon:"🏋️"},
  {year:2015,num:"15.2",type:"AMRAP 6min x3",     rx:"padrao",                    scaled:"adaptado",                    desc:"Escada crescente de Pull-Up e OHS com 3min rest entre rounds",icon:"🔄"},
  {year:2015,num:"15.3",type:"AMRAP 14min",       rx:"Muscle-Up",                 scaled:"Pull-Up kipping",             desc:"7 Muscle-Up / 50 Wall Ball 9/6kg / 100 DU",icon:"💫"},
  {year:2015,num:"15.4",type:"AMRAP 8min",        rx:"HSPU padrao",               scaled:"Pike Push-Up",                desc:"3 HSPU + 3 Clean 61/43kg — 6/6 — 9/9 — 12/12...",icon:"🤸"},
  {year:2015,num:"15.5",type:"For Time",          rx:"Thruster 43/30kg",          scaled:"30/20kg",                     desc:"27-21-15-9: Thruster + Row (Cal)",icon:"🚣"},
];

// ═══════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════
const FUNDAMENTALS = [
  {id:"clean",       label:"Clean & Jerk",   emoji:"🏋️", cat:"Halterofilia"},
  {id:"snatch",      label:"Snatch",         emoji:"⚡",  cat:"Halterofilia"},
  {id:"front_squat", label:"Front Squat",    emoji:"🦴",  cat:"Halterofilia"},
  {id:"deadlift",    label:"Deadlift",       emoji:"💪",  cat:"Halterofilia"},
  {id:"back_squat",  label:"Back Squat",     emoji:"🏗️", cat:"Halterofilia"},
  {id:"thruster",    label:"Thruster",       emoji:"🔥",  cat:"Halterofilia"},
  {id:"push_jerk",   label:"Push Jerk",      emoji:"🔝",  cat:"Halterofilia"},
  {id:"bmu",         label:"Bar Muscle-Up",  emoji:"🔄",  cat:"Ginastica"},
  {id:"rmu",         label:"Ring Muscle-Up", emoji:"💫",  cat:"Ginastica"},
  {id:"hspu",        label:"HSPU",           emoji:"🤸",  cat:"Ginastica"},
  {id:"hs_walk",     label:"Handstand Walk", emoji:"🙆",  cat:"Ginastica"},
  {id:"pistol",      label:"Pistol Squat",   emoji:"🦵",  cat:"Ginastica"},
  {id:"rope",        label:"Rope Climb",     emoji:"🧗",  cat:"Ginastica"},
  {id:"ttb",         label:"Toes to Bar",    emoji:"🎯",  cat:"Ginastica"},
  {id:"du",          label:"Double Unders",  emoji:"🪢",  cat:"Cardio"},
  {id:"rowing",      label:"Rowing",         emoji:"🚣",  cat:"Cardio"},
  {id:"run",         label:"Running",        emoji:"🏃",  cat:"Cardio"},
  {id:"assault",     label:"Assault Bike",   emoji:"🚴",  cat:"Cardio"},
];
const LEVELS = [
  {id:"amador",      label:"Amador",      color:"#4CAF50", sub:"Iniciante"},
  {id:"scaled",      label:"Scaled",      color:"#FF9800", sub:"Intermediario"},
  {id:"rx",          label:"RX",          color:"#2196F3", sub:"Padrao"},
  {id:"competitivo", label:"Competitivo", color:"#E91E63", sub:"Elite"},
];
const DURATIONS  = [45,60,75,90,120];
const DAYS_S     = ["SEG","TER","QUA","QUI","SEX","SAB"];
const WOD_CATS   = ["Todos","Halterofilia","Ginastica","Cardio","Metcon","Classico","Hero WOD","Forca","Chipper","Endurance","Competicao","Open Style","Kettlebell","Iniciante","Time","Core","Benchmark","Acessorio"];
const OPEN_YEARS = ["Todos","2024","2023","2022","2021","2020","2019","2018","2017","2016","2015"];
const CAT_CLR    = {Halterofilia:"#FF9800",Ginastica:"#9C27B0",Cardio:"#00BCD4",Metcon:"#FF3D00",Classico:"#2196F3","Hero WOD":"#f44336",Forca:"#795548",Chipper:"#E91E63",Endurance:"#009688",Competicao:"#FFD700","Open Style":"#FF6B35",Kettlebell:"#66BB6A",Iniciante:"#4CAF50",Time:"#A1887F",Core:"#26A69A",Benchmark:"#3F51B5",Acessorio:"#607D8B"};

// ═══════════════════════════════════════════════════════════════
// GERADOR LOCAL AVANCADO — Coach L4 Algorithm
// Templates reais variados: ON/OFF, Relay, Chipper, Death By, etc.
// Funciona 100% offline, sem API, sem erros de sandbox
// ═══════════════════════════════════════════════════════════════

// ── AQUECIMENTOS ESPECIFICOS POR FUNDAMENTO ──────────────────
const AQ_TITULO = {
  clean:"Barbell Cycling — Clean", snatch:"Barbell Cycling — Snatch",
  front_squat:"Front Rack Activation", deadlift:"Posterior Chain Activation",
  back_squat:"Squat Activation", thruster:"Full Body Activation",
  push_jerk:"Overhead Activation", bmu:"Gymnastics Upper Body",
  rmu:"Ring Work Activation", hspu:"Handstand Activation",
  hs_walk:"Handstand Progressions", pistol:"Single Leg Activation",
  rope:"Grip & Pull Activation", ttb:"Core & Hip Flexor",
  du:"Jump Rope Technique", rowing:"Rowing Technique",
  run:"Running Drills", assault:"Bike Activation",
};
const AQ_MOV = {
  clean:"- Cluster | Hang Cluster | Thruster\n- Butterfly Pull-Up | Kipping Pull-Up",
  snatch:"- OHS | Snatch Balance | Hang Snatch\n- Duo Devil Press | DB Snatch",
  front_squat:"- Front Squat | Pausa | Slow Eccentric\n- Push Press | Push Jerk",
  deadlift:"- Deadlift | Slow Eccentric | Romanian DL\n- Handstand | Kipping HSPU",
  back_squat:"- Back Squat | Box Squat | Pause Squat\n- KB Swing | Box Jump",
  thruster:"- Thruster | Cluster | Wall Ball\n- Butterfly Pull-Up | CTB",
  push_jerk:"- Push Press | Push Jerk | Split Jerk\n- Strict Pull-Up | Muscle-Up",
  bmu:"- Kipping Swing | Chest-to-Bar | Bar Muscle-Up\n- Power Clean | Box Jump",
  rmu:"- Ring Row | Ring Dip | Ring Muscle-Up\n- OHS | Squat Snatch",
  hspu:"- Handstand Hold | Strict HSPU | Kipping HSPU\n- Deadlift | Slow Eccentric",
  hs_walk:"- Handstand Hold | Shoulder Tap | HS Walk\n- Pistol | Box Jump",
  pistol:"- Box Pistol | Pistol | Bulgarian Split Squat\n- TTB | KB Swing",
  rope:"- Rope Pull | Rope Climb | Legless Rope Climb\n- Power Clean | Box Jump",
  ttb:"- Kipping Swing | Knee Raise | TTB\n- Power Snatch | DU",
  du:"- Single Under | DU | DU Unbroken\n- Hang Snatch | Box Jump",
  rowing:"- Rowing Technique | 500m Pace | 2k Test\n- Thruster | Burpee Over Bar",
  run:"- Running Drills | Strides | Tempo Run\n- Thruster | Box Jump",
  assault:"- Bike Technique | Sprint | Pace Work\n- KB Swing | Burpee",
};
const AQ_MOV_DEF = "- Movimentos do fundamento do dia\n- Mobilidade e ativacao especifica";

// ── STRENGTH WORK POR FUNDAMENTO ─────────────────────────────
const STRENGTH = {
  clean:[
    "A cada 2'30 por 10' (4x):\n1 Cluster\n1 Hang Cluster\n2 Thruster\n[@ 60-75% Clean]",
    "A cada 3' por 12' (4x):\n2 Power Clean [@ 75-85%]\n3 Hang Power Clean [@ 70%]\n[Foco: cotovelos rapidos]",
    "A cada 4' por 12' (3x):\n3 Squat Clean [@ 70-80%]\n3 Front Squat [@ 80%]\n[Sem descanso entre]",
  ],
  snatch:[
    "A cada 2'30 por 10' (4x) [@ 60-70% Snatch]:\n1 Snatch Deadlift\n2 Hang Snatch c/ pausa\n1 Snatch Balance",
    "A cada 3' por 12' (4x) [@ 60-70% Snatch]:\n2 Rounds:\n30\" ON | 30\" OFF — Hang Snatch\n20\" ON | 30\" OFF — Hang Snatch\n10\" ON | 30\" OFF",
    "A cada 2' por 10' (5x):\n3 Power Snatch [@ 65-75%]\n[Foco: cycling rapido e amplitude]",
  ],
  deadlift:[
    "A cada 4' por 12' (3x) [@ 60-80% DL]:\n4-6 Deadlift Slow Eccentric\n15\" Handstand Hold\n3-5 Strict HSPU",
    "A cada 3' por 12' (4x):\n5 Romanian DL [@ 70%]\n5 Deadlift [@ 80%]\n[Foco: posicao neutra da coluna]",
    "A cada 2'30 por 10' (4x):\n3 Deadlift [@ 85%]\n5 Box Jump Alto [maximo]\n[Potencia de quadril]",
  ],
  back_squat:[
    "A cada 3' por 12' (4x):\n4 Back Squat [@ 75-85%]\n[Slow eccentric 3s, explosivo na saida]",
    "A cada 4' por 16' (4x):\n3 Back Squat [@ 80%]\n5 Box Jump Over 60cm\n[Transferencia de potencia]",
    "A cada 3' por 9' (3x):\n8 Back Squat [@ 60-65%]\n[Volume de forca — foco tecnico]",
  ],
  front_squat:[
    "A cada 4' por 12' (3x) [@ 60-70%]:\n12 Front Squat\n10 Front Squat\n8 Front Squat\n[Cotovelos altos em todas as reps]",
    "A cada 3' por 12' (4x):\n5 Front Squat [@ 80%]\n[Velocidade na saida do buraco]",
    "A cada 2'30 por 10' (4x):\n3 Front Squat Pause [3s no fundo @ 70%]\n[Foco em posicao e estabilidade]",
  ],
  thruster:[
    "A cada 3' por 12' (4x):\n5 Thruster [@ 70-80%]\n5 CTB Pull-Up\n[Sem descanso entre os movimentos]",
    "A cada 2' por 10' (5x):\n3 Thruster [@ 80-85%]\n[Foco: dip & drive eficiente]",
    "A cada 4' por 12' (3x):\n10 Wall Ball\n7 Thruster [@ 65%]\n5 CTB Pull-Up\n[Ritmo de competicao]",
  ],
  push_jerk:[
    "A cada 3' por 12' (4x):\n3 Push Jerk [@ 80-90%]\n[Dip vertical, drive explosivo]",
    "A cada 2'30 por 10' (4x):\n2 Push Press + 2 Push Jerk + 1 Split Jerk\n[@ 70-80% — foco na transicao]",
    "A cada 4' por 12' (3x):\n5 Push Jerk [@ 75%]\n5 Strict Pull-Up\n[Forca overhead total]",
  ],
  bmu:[
    "A cada 4' por 12' (3x):\n15\" Chin-Up Hold (supinated grip)\n3-5 Weighted Strict Pull-Up\n1 Cluster + 1 Hang Cluster + 2 Thruster",
    "A cada 3' por 12' (4x):\n5 Strict Pull-Up\n5 Strict Dip\n3 BMU tecnicos\n[Foco: transicao limpa]",
    "A cada 2'30 por 10' (4x):\n3 CTB Strict + 3 BMU Kipping\n[Foco: pull forte, push no topo]",
  ],
  rmu:[
    "A cada 4' por 12' (3x):\n5 Ring Row Weighted\n5 Ring Dip Strict\n2 Ring Muscle-Up\n[False grip em todas as series]",
    "A cada 3' por 12' (4x):\n3 Strict Ring MU\n5 Ring Dip\n[Forca basica de argola]",
    "A cada 2'30 por 10' (4x):\n2 RMU + 5 Ring Dip\n[Cycling de argola]",
  ],
  hspu:[
    "A cada 4' por 12' (3x) [@ 60-80% DL]:\n4-6 Deadlift Slow Eccentric\n15\" Handstand Hold\n3-5 Strict HSPU",
    "A cada 3' por 12' (4x):\n5 Strict HSPU\n5 Deficit HSPU 5cm\n[Lockout completo]",
    "A cada 2'30 por 10' (4x):\n8 Kipping HSPU\n5 Strict Pull-Up\n[Ritmo de competicao]",
  ],
  rowing:[
    "A cada 4' por 12' (3x):\n500m Row [@ 85% — pace forte]\n[Rest = tempo restante do intervalo]",
    "A cada 3' por 12' (4x):\n15 Cal Row Sprint\n10 Thruster 43/30kg\n[Transicao direta]",
    "Barbell Cycling — Rowing:\n2 Rounds:\n30\" ON | 30\" OFF — Row Sprint\n20\" ON | 30\" OFF — Row Sprint\n10\" ON | 30\" OFF",
  ],
  run:[
    "A cada 4' por 12' (3x):\n400m Run [@ 85-90% — ritmo forte]\n[Foco: cadencia e postura]",
    "A cada 3' por 12' (4x):\n200m Run Sprint\n10 Thruster 43/30kg\n[Potencia aerobica]",
    "Intervalos de corrida:\n4 Rounds: 2'ON | 2'OFF\n100m Run\n4 Duo Devil Press\nMAX Box Jump",
  ],
  assault:[
    "A cada 3' por 12' (4x):\n15 Cal Assault Bike Sprint\n10 KB Swing 32/24kg\n[Potencia de bike + swing]",
    "Bike Intervals:\n4 Rounds: 1'ON | 1'OFF\n[Maximo de calorias em cada round]",
    "A cada 4' por 12' (3x):\n20 Cal Assault Bike\n10 Burpee Box Jump 60cm\n[Foco: cadencia alta na bike]",
  ],
  pistol:[
    "A cada 3' por 12' (4x):\n8 Weighted Box Pistol (moderado)\n8 KB Front Rack Box Step-Up (leve/moderado)\n[Foco: controle excentrico]",
    "A cada 4' por 12' (3x):\n5 Pistol Squat cada lado\n5 Bulgarian Split Squat pesado\n[Forca unilateral]",
    "A cada 2'30 por 10' (4x):\n10 Box Pistol + 10 Shrimp Squat\n[Progressao de pistol]",
  ],
  rope:[
    "A cada 3' por 12' (4x):\n2 Rope Climb\n5 Strict Pull-Up\n[J-hook perfeito, economize bracos]",
    "A cada 4' por 12' (3x):\n2 Legless Rope Climb\n5 Power Clean 70/47kg\n[Forca de puxada maxima]",
    "Skill: Rope Climb\n6x1 Rope Climb com pausa no meio\n[Foco: lock de pes e descida controlada]",
  ],
  ttb:[
    "A cada 3' por 12' (4x):\n12 TTB\n8 DB Snatch 50/35lb\n4 Wall Facing HSPU\n[Rest 1min btw sets]",
    "A cada 2'30 por 10' (4x):\n15 TTB\n10 Power Snatch 50/35kg\n[Ritmo de cycling]",
    "Skill: Toes to Bar\n5 sets: Max Unbroken TTB\n[Foco: kip eficiente]",
  ],
  du:[
    "Skill: Double Unders\n3 Rounds:\n30\" ON | 30\" OFF — DU sprint\n20\" ON | 30\" OFF — DU\n10\" ON | 30\" OFF",
    "A cada 2' por 10' (5x):\n30 DU + 5 Box Jump\n[Coordenacao e explosao]",
    "Barbell Cycling — DU:\n4x: 50 DU + 10 Power Snatch 50/35kg\n[Rest 2min entre sets]",
  ],
  hs_walk:[
    "A cada 3' por 12' (4x):\n10m Handstand Walk\n5 HSPU\n[Foco: linha do corpo]",
    "Skill: Handstand Walk\n10min EMOM:\n10m HS Walk (scaled: 30\" HS Hold)\n5 Strict HSPU",
    "A cada 4' por 12' (3x):\n15m HS Walk + 10 HSPU Deficit\n[Elite: adicionar peso no colete]",
  ],
};
const STR_DEF = ["A cada 3' por 12' (4x):\n5 Strict Pull-Up\n5 Push Press pesado\n8 Box Jump\n[Forca funcional combinada]"];

// ── BARBELL CYCLING / SKILL WORK ─────────────────────────────
const BC = {
  clean:[
    "Barbell Cycling — Clean:\n3 Rounds:\n30\" ON | 30\" OFF — Power Clean\n20\" ON | 30\" OFF — Hang Power Clean\n10\" ON | 30\" OFF\n[@ 60% — maximo de reps em cada intervalo]",
    "Cycling Work:\n4x 1min: 10 Power Clean [@ 60%]\nRest 1min entre sets\n[Foco: cycling rapido sem perder forma]",
  ],
  snatch:[
    "Barbell Cycling — Snatch:\n3 Rounds:\n30\" ON | 30\" OFF — Hang Power Snatch\n20\" ON | 30\" OFF\n10\" ON | 30\" OFF\n[@ 50-60% Snatch]",
    "OHS/Snatch Cycling:\n4x: 10 OHS + 5 Squat Snatch [@ 65%]\nRest 90s entre sets",
  ],
  deadlift:["Barbell Cycling — DL:\n4x: 8 Deadlift [@ 70%] + 6 Hang Power Clean [@ 65%]\nRest 90s\n[Foco: posicao neutra]"],
  thruster:["Barbell Cycling — Thruster:\n4x: 10 Thruster [@ 65%]\nRest 90s\n[Foco: cycling fluido sem pausa]"],
  push_jerk:["Barbell Cycling — Jerk:\n4x: 5 Push Jerk [@ 75%] + 5 Push Press [@ 80%]\nRest 90s"],
  bmu:["Gymnastics Volume:\n5 sets: 3-5 BMU + 5 CTB\nRest 90s\n[Foco: kip consistente]"],
  rmu:["Ring Cycling:\n4 sets: 3 RMU + 5 Ring Dip\nRest 90s\n[False grip sempre]"],
  hspu:["HSPU Volume:\n4 sets: 10 Kipping HSPU\nRest 90s\n[Lockout completo + head through]"],
  rowing:["Rowing Intervals:\n4x 250m Row Sprint\nRest 1min\n[Foco: potencia por remada]"],
  run:["Running Intervals:\n4x 200m Sprint @ 90%\nRest 1min\n[Foco: cadencia e postura]"],
  assault:["Bike Sprint Work:\n6x 10 Cal Assault Bike Sprint\nRest 1min\n[Maximo de potencia]"],
  pistol:["Pistol Progressions:\n4 sets: 8 Box Pistol + 6 Pistol livre\nRest 90s\n[Heel down sempre]"],
  rope:["Rope Climb Volume:\n5x 1 Rope Climb\nRest 1min\n[Foco: lock e economizar bracos]"],
  ttb:["TTB Cycling:\n4 sets: Max Unbroken TTB\nRest 90s\n[Foco: kip eficiente]"],
  du:["DU Volume:\n4 sets: Max Unbroken DU\nRest 1min\n[Foco: pulso relaxado]"],
};
const BC_DEF = ["Skill Work:\n4 sets: 10 Strict Pull-Up + 5 HSPU\nRest 90s"];

// ── WODs VARIADOS — 6 categorias x templates ─────────────────
// Cada template tem nome, formato, desc, rx, scaled, carga, tip

const W_FORTE = [  // SEG — For Time ou AMRAP intenso
  {n:"FRAN SHARK",  fmt:"For Time 7min",  tc:"7min",
   d:"21-15-9\nThruster {carga_t}\nPull-Up",
   rx:"Thruster {rx_t}",sc:"Thruster {sc_t}, Ring Row",carga:"{c_t}",
   tip:"Nao pare no fundo do squat. Use o elastic. Pull-Up: quebre antes de falhar."},
  {n:"BARBELL STORM", fmt:"For Time 12min", tc:"12min",
   d:"3 Rounds:\n7 {mov1}\n14 Box Jump Over 60/50cm\n21 DU",
   rx:"{rx1}",sc:"{sc1}",carga:"{c1}",
   tip:"Ritmo consistente. Box jump: foca na recepcao."},
  {n:"CLEAN FIRE",  fmt:"For Time 10min", tc:"10min",
   d:"30 {mov1}\n[Touch and go — cycling rapido]",
   rx:"{rx1}",sc:"{sc1}",carga:"{c1}",
   tip:"Sets de 5-7 do inicio. Nao va a falha muscular."},
  {n:"POWER SURGE", fmt:"AMRAP 12min",    tc:"12min",
   d:"5 {mov1}\n10 Box Jump 60cm\n15 Cal Row",
   rx:"{rx1}",sc:"{sc1}",carga:"{c1}",
   tip:"Escova do box jump e o descanso ativo. Mantenha ritmo no remo."},
  {n:"COMPLEX QUEEN",fmt:"For Time 14min", tc:"14min",
   d:"4 Rounds:\n5 {mov1}\n5 {mov1} Hang\n10 CTB Pull-Up",
   rx:"{rx1}",sc:"{sc1}",carga:"{c1}",
   tip:"Complex sem largar a barra. Respire no topo."},
];

const W_INTERVAL = [  // TER — Intervals, ON/OFF
  {n:"SHARK VERSION", fmt:"4 Rounds — 2'ON | 2'OFF", tc:"16min",
   d:"2'ON | 2'OFF — 4 Rounds:\n100m Run\n4 Duo Devil Press 22.5/15kg\nMAX {mov1}",
   rx:"{rx1}",sc:"{sc1}",carga:"{c1}",
   tip:"Saida explosiva. Os primeiros 30s da corrida definem o round."},
  {n:"ENDURANCE A",   fmt:"3 Rounds ON/OFF",         tc:"18min",
   d:"3 Rounds:\n30\" ON | 30\" OFF — {mov1}\n20\" ON | 30\" OFF — {mov1}\n10\" ON | 30\" OFF\n[MAX reps em cada intervalo]",
   rx:"{rx1}",sc:"{sc1}",carga:"{c1}",
   tip:"Maximo de reps em cada ON. Nao pule o OFF."},
  {n:"POWER INTERVALS",fmt:"5 Rounds — 1'ON|1'OFF",  tc:"10min",
   d:"5 Rounds — 1'ON | 1'OFF:\n10 Cal Assault Bike\n5 {mov1}\nMAX DU no tempo restante",
   rx:"{rx1}",sc:"{sc1}",carga:"{c1}",
   tip:"Bike em sprint. Transicao direta para o movimento."},
  {n:"TEMPO WORK",    fmt:"AMRAP 15min",              tc:"15min",
   d:"AMRAP 15min:\n200m Run\n8 {mov1}\n12 Wall Ball 9/6kg",
   rx:"{rx1}",sc:"{sc1}",carga:"{c1}",
   tip:"Ritmo de conversa. Voce deve conseguir falar durante o run."},
];

const W_CHIPPER = [  // QUA — Chipper, Rounds com rest
  {n:"CHIPPER BEAST",  fmt:"For Time 20min",         tc:"20min",
   d:"For Time — Chipper:\n30 Cal Row\n25 {mov1}\n20 Box Jump Over 60/50cm\n15 {mov1}\n10 BMU ou 20 CTB",
   rx:"{rx1}",sc:"{sc1}",carga:"{c1}",
   tip:"Divida em blocos mentais. O remo e o warmup do chipper."},
  {n:"BURPEE DIANE",   fmt:"For Time 17min (Em dupla)",tc:"17min",
   d:"Em dupla — Relay por round:\n21-15-9:\nBurpee Over Bar\n{mov1}\nHSPU",
   rx:"{rx1}",sc:"HSPU kipping ou Pike PU, {sc1}",carga:"{c1}",
   tip:"Relay perfeito: um faz, outro descansa. Nao passe a vez antes de completar."},
  {n:"5 ROUNDS GRIND", fmt:"5 Rounds For Time 20min", tc:"20min",
   d:"5 Rounds:\n7 {mov1}\n14 KB Swing 24/16kg\n21 Air Squat\n[Rest 1min btw rounds]",
   rx:"{rx1}",sc:"{sc1}",carga:"{c1}",
   tip:"O rest de 1min e parte do treino. Use-o para respirar, nao sente."},
  {n:"TRIPLET HEAVY",  fmt:"For Time 16min",          tc:"16min",
   d:"4 Rounds:\n10 {mov1}\n10 HSPU\n10 TTB\n[Rest 90s btw rounds]",
   rx:"{rx1}",sc:"{sc1}",carga:"{c1}",
   tip:"Pesado + gymnastics + core. Gerencie a energia desde o round 1."},
];

const W_DELOAD = [  // QUI — Curto e tecnico
  {n:"TECNICO",        fmt:"For Time 8min",           tc:"8min",
   d:"For Time — Tecnico:\n10 {mov1} [peso leve, perfeito]\n10 Ring Row\n10 DB Snatch 15/10kg alternado",
   rx:"{rx1} peso leve",sc:"Reduzir carga 40%",carga:"Leve — 40-50% do normal",
   tip:"Hoje e recuperacao ativa. Foco total em tecnica, nao velocidade."},
  {n:"EMOM SKILLS",    fmt:"EMOM 12min",              tc:"12min",
   d:"EMOM 12min:\nMin1: 5 {mov1} [tecnico]\nMin2: 5 Strict Pull-Up\nMin3: 10 Air Squat + 10 Sit-Up",
   rx:"{rx1} leve",sc:"Reduzir carga",carga:"60-65% do 1RM",
   tip:"Qualidade acima de tudo. Se o movimento nao estiver bonito, reduza a carga."},
  {n:"RECOVERY WOD",   fmt:"3 Rounds Light",          tc:"10min",
   d:"3 Rounds:\n8 {mov1} [peso light]\n8 KB Swing 16kg\n200m Trote",
   rx:"Peso light",sc:"Sem carga",carga:"40% do 1RM",
   tip:"Dia de deload. Mobilidade e tecnica. Recupere para sexta."},
];

const W_INTENSO = [  // SEX — Intenso, EMOM pesado, Death By
  {n:"DEATH BY",       fmt:"Death By — crescente",    tc:"15min",
   d:"Death By {mov1}:\nMin 1: 1 rep\nMin 2: 2 reps\nMin 3: 3 reps\n[Continue ate nao conseguir completar no minuto]",
   rx:"{rx1}",sc:"{sc1}",carga:"{c1}",
   tip:"Parece facil nos primeiros minutos. Gerencie a fadiga a partir do min 8."},
  {n:"HEAVY FRIDAY",   fmt:"EMOM 16min",              tc:"16min",
   d:"EMOM 16min (4 movimentos):\nMin1: 5 {mov1} pesado\nMin2: 5 HSPU\nMin3: 10 TTB\nMin4: 15 Cal Bike",
   rx:"{rx1} pesado (85%)",sc:"Cargas reduzidas",carga:"85% do 1RM",
   tip:"O EMOM pesado e o teste real. Se nao completar no minuto, reduza."},
  {n:"SEX INTENSA",    fmt:"For Time 14min",          tc:"14min",
   d:"For Time:\n21 {mov1}\n21 Bar Facing Burpee\n15 {mov1}\n15 Bar Facing Burpee\n9 {mov1}\n9 Bar Facing Burpee",
   rx:"{rx1}",sc:"{sc1}",carga:"{c1}",
   tip:"Burpee e sempre honesto. Mantenha ritmo constante mesmo cansado."},
  {n:"BLITZ FINAL",    fmt:"3 Rounds — 2'ON|1'OFF",  tc:"9min",
   d:"3 Rounds — 2'ON | 1'OFF:\n10 {mov1}\n10 Box Jump 60cm\nMAX Cal Row no tempo restante",
   rx:"{rx1}",sc:"{sc1}",carga:"{c1}",
   tip:"Saida explosiva em cada round. O Row e o medidor de quanto sobrou."},
];

const W_SAB = [  // SAB — Longo em dupla
  {n:"ENDURANCE B",   fmt:"For Time 28min (Em dupla)",tc:"28min",
   d:"Em dupla — [Relay por round]:\n\n10 Rounds:\n5 Deadlift 102/70kg\n5 High Box Jump 60cm\n___\n8 Rounds:\n12 Box Jump Over 60cm\n8 Deficit HSPU\n12 TTB\n___\n10 Rounds:\n5 Deadlift 102/70kg\n5 High Box Jump 60cm",
   rx:"DL 102/70kg, Box 60cm",sc:"DL 70/47kg, Box 50cm",carga:"102/70kg",
   tip:"Sabado e dia de comunidade! Relay perfeito — quando um para o outro vai."},
  {n:"ENDURANCE A",   fmt:"For Time 28min (Em dupla)",tc:"28min",
   d:"Em dupla — syncro:\n\n400m Run syncro (2)\n30 Burpee Over Bar syncro (2)\n25 {mov1} syncro [Barbell + Dumbell]\n60 Pull-Up dividido\n___\n400m Run syncro\n25 Burpee Over Bar syncro\n20 {mov1} syncro\n40 CTB Pull-Up dividido\n___\n400m Run syncro\n20 Burpee Over Bar syncro\n15 {mov1} syncro\n20 Bar Muscle-Up dividido",
   rx:"{rx1}",sc:"{sc1}",carga:"{c1}",
   tip:"Syncro = os dois movem juntos. Comunique com seu parceiro antes de cada set."},
  {n:"THE LONG GAME", fmt:"For Time 32min (Em dupla)",tc:"32min",
   d:"Em dupla — Relay por round:\n\n5 Rounds:\n400m Run (alternado — 200m cada)\n10 {mov1} (alternado)\n15 KB Swing 32/24kg (alternado)\n___\n3 Rounds:\n600m Run (alternado — 300m cada)\n8 {mov1} (alternado)\n10 Box Jump Over 60cm (alternado)",
   rx:"{rx1}, KB 32/24kg",sc:"{sc1}, KB 24/16kg",carga:"{c1}",
   tip:"Volume alto. Gerencie o ritmo da corrida desde o inicio."},
  {n:"TRIPLE THREAT", fmt:"For Time 30min (Em dupla)",tc:"30min",
   d:"Em dupla — Relay por round:\n\nRound A — 4x:\n10 {mov1}\n15 Box Jump 60cm\n20 DU\n___\nRound B — 3x:\n250m Row (1 pessoa por vez)\n10 {mov1}\n15 Wall Ball 9/6kg\n___\nRound C — 2x:\n400m Run syncro\n15 {mov1}\n10 BMU ou 20 CTB dividido",
   rx:"{rx1}",sc:"{sc1}",carga:"{c1}",
   tip:"Tres blocos com progressao de dificuldade. Distribuam as partes conforme a forca de cada um."},
];

// ── DADOS POR FUNDAMENTO ─────────────────────────────────────
const FUND_WOD = {
  clean:{m:"Power Clean 60/43kg",rx:"60/43kg",sc:"43/30kg",c:"60/43kg (135/95lb)"},
  snatch:{m:"Hang Power Snatch 50/35kg",rx:"50/35kg",sc:"35/25kg",c:"50/35kg (110/75lb)"},
  front_squat:{m:"Front Squat 70/50kg",rx:"70/50kg",sc:"50/35kg",c:"70/50kg (155/110lb)"},
  deadlift:{m:"Deadlift 100/70kg",rx:"100/70kg",sc:"70/47kg",c:"100/70kg (225/155lb)"},
  back_squat:{m:"Back Squat 80/55kg",rx:"80/55kg",sc:"60/40kg",c:"80/55kg (175/120lb)"},
  thruster:{m:"Thruster 43/30kg",rx:"43/30kg",sc:"30/20kg",c:"43/30kg (95/65lb)"},
  push_jerk:{m:"Push Jerk 60/43kg",rx:"60/43kg",sc:"43/30kg",c:"60/43kg (135/95lb)"},
  bmu:{m:"Bar Muscle-Up",rx:"BMU padrao",sc:"CTB Pull-Up",c:"Peso corporal"},
  rmu:{m:"Ring Muscle-Up",rx:"RMU padrao",sc:"CTB + Ring Dip",c:"Peso corporal"},
  hspu:{m:"HSPU Kipping",rx:"HSPU kipping",sc:"Pike Push-Up",c:"Peso corporal"},
  hs_walk:{m:"Handstand Walk 10m",rx:"HS Walk 10m",sc:"HS Hold 30s",c:"Peso corporal"},
  pistol:{m:"Pistol Squat",rx:"Pistol livre",sc:"Box Pistol",c:"Peso corporal"},
  rope:{m:"Rope Climb 4.5m",rx:"Rope Climb J-hook",sc:"Rope Pull sentado",c:"Peso corporal"},
  ttb:{m:"Toes to Bar",rx:"TTB padrao",sc:"Knee Raise",c:"Peso corporal"},
  du:{m:"Double Under",rx:"Double Under",sc:"Single Under x2",c:"Corda"},
  rowing:{m:"Cal Row / 500m Row",rx:"Row padrao",sc:"Row reduzido",c:"Remo"},
  run:{m:"400m Run",rx:"Run padrao",sc:"Run reduzido",c:"Corrida"},
  assault:{m:"Cal Assault Bike",rx:"Assault Bike",sc:"Cal reduzido",c:"Bike"},
};
const FUND_DEF = {m:"Power Clean 60/43kg",rx:"60/43kg",sc:"43/30kg",c:"60/43kg"};

function pick(arr, seed) { return arr[Math.abs(seed) % arr.length]; }

function fillTemplate(tmpl, fund, fundIdx) {
  const fd = FUND_WOD[fund] || FUND_DEF;
  const thFunds = ["thruster","clean","front_squat"];
  const cThrust = FUND_WOD[thFunds[fundIdx % thFunds.length]] || FUND_DEF;
  return {
    nome: tmpl.n,
    formato: tmpl.fmt,
    timecap: tmpl.tc,
    descricao: tmpl.d
      .replace(/{mov1}/g, fd.m)
      .replace(/{carga_t}/g, cThrust.m)
      .replace(/{rx_t}/g, cThrust.rx)
      .replace(/{sc_t}/g, cThrust.sc)
      .replace(/{c_t}/g, cThrust.c),
    rx: tmpl.rx.replace(/{rx1}/g, fd.rx),
    scaled: tmpl.sc.replace(/{sc1}/g, fd.sc),
    carga: tmpl.carga.replace(/{c1}/g, fd.c),
    tip: tmpl.tip,
  };
}

function generateWeek({fundamentals, level, duration}) {
  const f0   = fundamentals[0] || "clean";
  const f0l  = FUNDAMENTALS.find(f=>f.id===f0)?.label || "Clean";
  const f1l  = fundamentals[1] ? (FUNDAMENTALS.find(f=>f.id===fundamentals[1])?.label || "") : "";
  const seed = fundamentals.reduce((a,f)=>a+f.charCodeAt(0),0) + duration;

  const tema = f0l.toUpperCase() + (f1l?" + "+f1l.toUpperCase():"") + " — SEMANA";

  const DAY_DEFS = [
    {dia:"Segunda",short:"SEG",foco:"Potencia + Forca",       fund:fundamentals[0]||f0, wods:W_FORTE,    idx:seed},
    {dia:"Terca",  short:"TER",foco:"Resistencia + Intervals", fund:fundamentals[1]||f0, wods:W_INTERVAL, idx:seed+1},
    {dia:"Quarta", short:"QUA",foco:"Forca + Volume",          fund:fundamentals[2]||f0, wods:W_CHIPPER,  idx:seed+2},
    {dia:"Quinta", short:"QUI",foco:"Deload Tecnico",          fund:fundamentals[0]||f0, wods:W_DELOAD,   idx:seed+3},
    {dia:"Sexta",  short:"SEX",foco:"Alta Intensidade",        fund:fundamentals[1]||f0, wods:W_INTENSO,  idx:seed+4},
    {dia:"Sabado", short:"SAB",foco:"WOD Longo Em Dupla",      fund:fundamentals[0]||f0, wods:W_SAB,      idx:seed+5},
  ];

  const dias = DAY_DEFS.map((dd, i) => {
    const af   = dd.fund;
    const strArr= STRENGTH[af] || STR_DEF;
    const bcArr = BC[af] || BC_DEF;
    const wTmpl = pick(dd.wods, dd.idx + i);
    return {
      dia: dd.dia,
      short: dd.short,
      foco: dd.foco,
      aquecimento: {
        titulo: AQ_TITULO[af] || "Aquecimento Especifico",
        movimentos: AQ_MOV[af] || AQ_MOV_DEF,
        strength: pick(strArr, dd.idx + i),
      },
      barbell_cycling: dd.short==="SAB" ? "N/A" : pick(bcArr, dd.idx + i + 1),
      wod: fillTemplate(wTmpl, af, i),
    };
  });

  return {tema, dias};
}
// ═══════════════════════════════════════════════════════════════
// CSS
// ═══════════════════════════════════════════════════════════════
const CSS=`
*{box-sizing:border-box;margin:0;padding:0;}
:root{--bg:#090a0f;--surf:#13151e;--card:#1b1e2a;--bdr:#ffffff10;--bdr2:#ffffff18;--acc:#FF3D00;--adim:#FF3D0015;--acc2:#FFB300;--txt:#eef0f8;--sub:#8892a4;--dim:#2e3446;}
body{font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--txt);min-height:100vh;}
.app{max-width:480px;margin:0 auto;padding-bottom:80px;}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--bdr);background:var(--bg);position:sticky;top:0;z-index:100;}
.brand{font-weight:900;font-size:20px;letter-spacing:2px;}
.brand span{color:var(--acc);}
.pro-badge{background:linear-gradient(135deg,#7C3AED,#2563eb);border-radius:20px;padding:3px 10px;font-size:10px;font-weight:700;letter-spacing:1px;color:#fff;}
.nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:var(--surf);border-top:1px solid var(--bdr);display:flex;z-index:200;}
.ni{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:9px 4px;border:none;background:none;color:var(--sub);font-size:9px;font-weight:700;letter-spacing:.5px;cursor:pointer;gap:3px;transition:color .15s;}
.ni.on{color:var(--acc);}
.ni-icon{font-size:18px;}
.ph{padding:16px 16px 8px;}
.pt{font-size:21px;font-weight:900;}
.ps{font-size:12px;color:var(--sub);margin-top:2px;}
.ph-row{display:flex;align-items:flex-start;justify-content:space-between;}
.blk{margin:0 12px 10px;border-radius:12px;overflow:hidden;background:var(--card);border:1px solid var(--bdr);}
.blk-hdr{display:flex;align-items:center;gap:9px;padding:11px 14px;border-bottom:1px solid var(--bdr);}
.blk-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}
.blk-ttl{font-weight:800;font-size:14px;}
.blk-sub{font-size:11px;color:var(--sub);margin-top:1px;}
.blk-min{margin-left:auto;font-size:10px;color:var(--sub);background:var(--bdr);padding:3px 7px;border-radius:4px;font-weight:700;}
.blk-body{padding:12px 14px;}
.blk-desc{font-size:13px;line-height:1.8;color:#bcc5d4;white-space:pre-line;}
.blk-label{font-size:9px;letter-spacing:2px;color:var(--acc);font-weight:700;text-transform:uppercase;margin-bottom:5px;}
.wod-nome{font-family:system-ui;font-weight:900;font-size:16px;color:var(--txt);margin-bottom:4px;}
.wod-formato{font-size:10px;color:var(--acc);font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;}
.rxsc{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:10px;}
.rxb{background:#2196F310;border:1px solid #2196F325;border-radius:8px;padding:9px;}
.scb{background:#FF980010;border:1px solid #FF980025;border-radius:8px;padding:9px;}
.rxl{font-size:9px;font-weight:700;letter-spacing:2px;color:#60a5fa;margin-bottom:3px;}
.scl{font-size:9px;font-weight:700;letter-spacing:2px;color:#fb923c;margin-bottom:3px;}
.rxt,.sct{font-size:11px;color:#bcc5d4;line-height:1.4;}
.carga-box{margin-top:8px;background:#ffffff08;border-radius:7px;padding:7px 10px;font-size:12px;color:var(--sub);}
.tip{margin-top:9px;background:#FFB30010;border:1px solid #FFB30022;border-radius:8px;padding:9px 12px;font-size:12px;color:var(--acc2);line-height:1.5;}
.tip::before{content:"Coach: ";font-weight:800;}
.loading-box{margin:0 12px;border-radius:12px;background:var(--card);border:1px solid var(--bdr);padding:30px 20px;text-align:center;}
.loading-title{font-weight:900;font-size:16px;margin-bottom:8px;color:var(--txt);}
.loading-sub{font-size:12px;color:var(--sub);margin-bottom:16px;line-height:1.6;}
.loading-bar{width:100%;height:3px;background:var(--bdr);border-radius:2px;overflow:hidden;}
.loading-fill{height:100%;background:var(--acc);border-radius:2px;animation:fill 1.8s ease-in-out infinite;}
@keyframes fill{0%{width:0;margin-left:0;}60%{width:70%;margin-left:0;}100%{width:0;margin-left:100%;}}
.week-hdr{margin:0 12px 12px;background:linear-gradient(135deg,#7C3AED20,var(--card));border:1px solid var(--bdr2);border-radius:12px;padding:14px;}
.wt{font-size:17px;font-weight:900;color:var(--acc);margin-bottom:4px;}
.day-tabs{display:flex;gap:4px;overflow-x:auto;padding:0 12px 10px;}
.dt{flex-shrink:0;padding:6px 12px;border-radius:8px;border:1.5px solid var(--bdr2);background:none;color:var(--sub);font-size:11px;font-weight:700;letter-spacing:1px;cursor:pointer;transition:all .15s;}
.dt.on{border-color:var(--acc);color:var(--acc);background:var(--adim);}
.foco-tag{margin:0 12px 9px;display:inline-block;background:var(--adim);border:1px solid #FF3D0020;color:var(--acc);font-size:9px;font-weight:700;letter-spacing:2px;padding:4px 10px;border-radius:5px;text-transform:uppercase;}
.sat-badge{margin:0 12px 9px;display:inline-block;background:#22c55e15;border:1px solid #22c55e30;color:#22c55e;font-size:9px;font-weight:700;letter-spacing:2px;padding:4px 10px;border-radius:5px;text-transform:uppercase;}
.wcard{margin:0 12px 9px;border-radius:12px;overflow:hidden;background:var(--card);border:1px solid var(--bdr);}
.wc-top{display:flex;align-items:center;gap:9px;padding:11px 13px;border-bottom:1px solid var(--bdr);}
.wc-ico{width:34px;height:34px;border-radius:8px;background:var(--acc);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.wc-name{font-weight:900;font-size:15px;}
.wc-type{font-size:10px;color:var(--sub);}
.wc-cat{margin-left:auto;font-size:9px;padding:3px 7px;border-radius:4px;font-weight:700;white-space:nowrap;}
.wc-body{padding:11px 13px;}
.wc-moves{display:flex;flex-direction:column;gap:2px;margin-bottom:7px;}
.wc-move{font-size:12px;color:#bcc5d4;display:flex;align-items:baseline;gap:5px;}
.wc-move::before{content:"▸";color:var(--acc);font-size:9px;flex-shrink:0;}
.wc-meta{display:flex;gap:6px;align-items:center;flex-wrap:wrap;}
.wc-reps{font-size:12px;font-weight:700;color:var(--acc);}
.wc-tc{font-size:10px;color:var(--sub);background:var(--bdr);padding:2px 6px;border-radius:4px;}
.wc-desc{font-size:11px;color:var(--sub);margin-top:6px;line-height:1.5;}
.ocard{margin:0 12px 9px;border-radius:12px;overflow:hidden;background:var(--card);border:1px solid var(--bdr);}
.oc-top{display:flex;align-items:center;gap:9px;padding:11px 13px;border-bottom:1px solid var(--bdr);}
.oc-ico{width:34px;height:34px;border-radius:8px;background:#7C3AED;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.oc-num{font-weight:900;font-size:16px;color:var(--acc);}
.oc-type{font-size:10px;color:var(--sub);}
.oc-year{margin-left:auto;background:var(--bdr);border-radius:4px;padding:3px 7px;font-size:10px;color:var(--sub);font-weight:700;}
.oc-body{padding:11px 13px;}
.oc-desc{font-size:13px;color:#bcc5d4;line-height:1.7;margin-bottom:9px;}
.oc-rxsc{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
.cat-lbl{font-size:9px;letter-spacing:2px;color:var(--sub);font-weight:700;text-transform:uppercase;padding:7px 12px 5px;}
.fund-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:6px;padding:0 12px;margin-bottom:8px;}
.fi{background:var(--card);border:1.5px solid var(--bdr);border-radius:9px;padding:10px 6px;text-align:center;cursor:pointer;transition:border-color .15s;}
.fi.sel{border-color:var(--acc);background:var(--adim);}
.fi.dis{opacity:.3;pointer-events:none;}
.fi-em{font-size:19px;margin-bottom:3px;}
.fi-name{font-size:10px;font-weight:600;line-height:1.2;}
.tags{display:flex;flex-wrap:wrap;gap:5px;padding:0 12px;margin-bottom:9px;}
.tag{display:flex;align-items:center;gap:4px;background:var(--adim);border:1px solid #FF3D0030;color:var(--acc);font-size:11px;font-weight:600;padding:4px 9px;border-radius:20px;}
.tag-x{cursor:pointer;font-size:13px;opacity:.7;}
.opts{display:grid;grid-template-columns:1fr 1fr;gap:9px;padding:0 12px;margin-bottom:12px;}
.og label{display:block;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--sub);font-weight:700;margin-bottom:7px;}
.pills{display:flex;flex-wrap:wrap;gap:5px;}
.pill{padding:6px 10px;border-radius:6px;border:1.5px solid var(--bdr2);background:none;color:var(--txt);font-size:11px;font-weight:600;cursor:pointer;transition:all .15s;}
.pill.on{border-color:var(--acc);color:var(--acc);background:var(--adim);}
.gen-btn{display:block;margin:0 12px;width:calc(100% - 24px);padding:15px;background:var(--acc);border:none;border-radius:12px;color:#fff;font-size:17px;font-weight:900;letter-spacing:2px;cursor:pointer;transition:opacity .15s;}
.gen-btn:disabled{opacity:.4;cursor:not-allowed;}
.err-box{background:#ef444415;border:1px solid #ef444430;border-radius:8px;padding:9px 12px;color:#f87171;font-size:12px;margin:0 12px 9px;line-height:1.5;}
.small-btn{background:var(--card);border:1px solid var(--bdr2);border-radius:7px;padding:5px 11px;color:var(--sub);font-size:11px;cursor:pointer;}
.fstrip{display:flex;gap:5px;overflow-x:auto;padding:0 12px 9px;}
.fp{padding:6px 12px;border-radius:20px;border:1px solid var(--bdr2);background:none;color:var(--sub);font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;transition:all .15s;}
.fp.on{background:var(--acc);color:#fff;border-color:var(--acc);}
.sl{font-size:10px;color:var(--sub);padding:0 12px 8px;}
.search-inp{width:calc(100% - 24px);margin:0 12px 8px;padding:9px 12px;background:var(--card);border:1.5px solid var(--bdr2);border-radius:9px;color:var(--txt);font-size:13px;outline:none;display:block;}
.empty{text-align:center;padding:50px 20px;color:var(--sub);}
.empty-ico{font-size:44px;margin-bottom:10px;opacity:.4;}
.empty-ttl{font-size:18px;font-weight:900;margin-bottom:5px;color:var(--txt);}
::-webkit-scrollbar{height:0;width:0;}
@media(max-width:400px){.opts{grid-template-columns:1fr;}}
`;


function programToText(program) {
  if (!program || !program.dias) return "";
  var lines = ["BOXCODE — " + (program.tema||"SEMANA"), ""];
  program.dias.forEach(function(day) {
    var aq = day.aquecimento || {};
    var w  = day.wod || {};
    lines.push("════════════════════");
    lines.push((day.dia||"").toUpperCase() + " — " + (day.foco||""));
    lines.push("");
    lines.push("🟢 ALONGAMENTO (8min)");
    lines.push(day.alongamento||"");
    lines.push("");
    lines.push("🔵 " + (aq.titulo||"AQUECIMENTO") + " (10min)");
    if (aq.movimentos) lines.push(aq.movimentos);
    if (aq.strength)   { lines.push(""); lines.push(aq.strength); }
    if (day.barbell_cycling && day.barbell_cycling !== "N/A") {
      lines.push(""); lines.push("🟣 BARBELL CYCLING / SKILL");
      lines.push(day.barbell_cycling);
    }
    lines.push("");
    lines.push("🔴 WOD — " + (w.nome||"METCON"));
    lines.push(w.formato||"");
    lines.push(w.descricao||w.desc||"");
    if (w.rx)     lines.push("RX: " + w.rx);
    if (w.scaled) lines.push("Scaled: " + w.scaled);
    if (w.carga)  lines.push("Carga: " + w.carga);
    if (w.tip)    lines.push("Coach: " + w.tip);
    lines.push("");
  });
  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════════
// EXPORTAR PDF — usando window.print() com CSS @media print
// ═══════════════════════════════════════════════════════════════
function exportPDF(program) {
  const DAYS_F = ["Segunda","Terca","Quarta","Quinta","Sexta","Sabado"];
  const dias = program.dias || [];

  const rows = dias.map(function(day) {
    var aq = day.aquecimento || {};
    var w  = day.wod || {};
    var isSat = day.short === "SAB";
    var nl = function(s){ return (s||"").split("\n").join("<br>"); };
    var bcBlock = (!isSat && day.barbell_cycling && day.barbell_cycling !== "N/A")
      ? '<div class="section purple"><div class="sec-label">BARBELL CYCLING / SKILL WORK</div><div class="sec-body">' + nl(day.barbell_cycling) + '</div></div>'
      : "";
    var cargaBlock = w.carga ? '<div class="carga">Carga sugerida: ' + (w.carga) + '</div>' : "";
    var tipBlock   = w.tip   ? '<div class="tip">Coach: ' + (w.tip) + '</div>' : "";
    return '<div class="day-page">'
      + '<div class="day-header"><div class="day-badge">' + (day.short) + '</div>'
      + '<div><div class="day-title">' + (day.dia) + '</div>'
      + '<div class="day-foco">' + (day.foco||"") + '</div></div></div>'
      + '<div class="section green"><div class="sec-label">ALONGAMENTO</div>'
      + '<div class="sec-body">' + nl(day.alongamento) + '</div></div>'
      + '<div class="section blue"><div class="sec-label">' + (aq.titulo||"AQUECIMENTO") + '</div>'
      + '<div class="sec-sub">Movimentos:</div><div class="sec-body">' + nl(aq.movimentos) + '</div>'
      + '<div class="sec-sub">Strength Work:</div><div class="sec-body">' + nl(aq.strength) + '</div></div>'
      + bcBlock
      + '<div class="section red"><div class="sec-label">WOD - ' + (w.nome||"METCON") + '</div>'
      + '<div class="wod-format">' + (w.formato||"") + '</div>'
      + '<div class="sec-body">' + nl(w.descricao||w.desc) + '</div>'
      + '<div class="rxsc-row">'
      + '<div class="rx-box"><div class="rx-lbl">RX</div><div class="rx-txt">' + (w.rx||"") + '</div></div>'
      + '<div class="sc-box"><div class="sc-lbl">SCALED</div><div class="sc-txt">' + (w.scaled||"") + '</div></div>'
      + '</div>' + cargaBlock + tipBlock + '</div></div>';
  }).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>BoxCode — ${program.tema}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, sans-serif; background: #fff; color: #111; }
  .cover { padding: 40px 32px 32px; border-bottom: 4px solid #FF3D00; margin-bottom: 24px; }
  .cover-logo { font-size: 28px; font-weight: 900; letter-spacing: 2px; color: #111; }
  .cover-logo span { color: #FF3D00; }
  .cover-tema { font-size: 20px; font-weight: 900; margin-top: 8px; color: #111; }
  .cover-sub { font-size: 13px; color: #666; margin-top: 4px; }
  .day-page { padding: 20px 24px; margin-bottom: 0; page-break-after: always; border-top: 3px solid #FF3D00; }
  .day-page:last-child { page-break-after: avoid; }
  .day-header { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
  .day-badge { background: #FF3D00; color: #fff; font-weight: 900; font-size: 14px; padding: 6px 12px; border-radius: 8px; letter-spacing: 1px; }
  .day-title { font-size: 18px; font-weight: 900; }
  .day-foco { font-size: 11px; color: #777; letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }
  .section { border-radius: 8px; padding: 12px 14px; margin-bottom: 10px; }
  .green { background: #f0fdf4; border-left: 4px solid #22c55e; }
  .blue  { background: #f0f9ff; border-left: 4px solid #00BCD4; }
  .purple{ background: #faf5ff; border-left: 4px solid #9C27B0; }
  .red   { background: #fff7f5; border-left: 4px solid #FF3D00; }
  .sec-label { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #333; margin-bottom: 7px; }
  .sec-sub { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #888; margin-bottom: 4px; }
  .sec-body { font-size: 12px; line-height: 1.8; color: #333; }
  .wod-format { font-size: 10px; font-weight: 800; color: #FF3D00; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
  .rxsc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
  .rx-box { background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 6px; padding: 8px; }
  .sc-box { background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 6px; padding: 8px; }
  .rx-lbl { font-size: 9px; font-weight: 800; color: #2563EB; letter-spacing: 2px; margin-bottom: 3px; }
  .sc-lbl { font-size: 9px; font-weight: 800; color: #EA580C; letter-spacing: 2px; margin-bottom: 3px; }
  .rx-txt, .sc-txt { font-size: 11px; color: #444; line-height: 1.4; }
  .carga { margin-top: 8px; background: #f5f5f5; border-radius: 5px; padding: 6px 10px; font-size: 11px; color: #555; }
  .tip { margin-top: 8px; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 6px; padding: 8px 10px; font-size: 11px; color: #92400E; line-height: 1.5; }
  .tip::before { content: "Coach: "; font-weight: 800; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .day-page { page-break-after: always; }
  }
</style>
</head>
<body>
  <div class="cover">
    <div class="cover-logo">BOX<span>CODE</span></div>
    <div class="cover-tema">${program.tema}</div>
    <div class="cover-sub">Programacao semanal gerada por BoxCode — Coach Level 4 Algorithm</div>
  </div>
  ${rows}
</body>
</html>`;

  // Also generate plain text version for sharing
  var txt = programToText(program);
  if (typeof window._setPdfModal === 'function') {
    window._setPdfModal({html: html, txt: txt});
  }
}

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════
function DayView({day}) {
  if (!day) return null;
  const w   = day.wod || {};
  const aq  = day.aquecimento || {};
  const isSat = day.short === "SAB";
  return (
    <div>
      {isSat
        ? <div className="sat-badge">SABADO — WOD LONGO EM DUPLA</div>
        : <div className="foco-tag">Foco: {day.foco}</div>
      }

      <div className="blk">
        <div className="blk-hdr">
          <div className="blk-dot" style={{background:"#22c55e"}}/>
          <div>
            <div className="blk-ttl">Alongamento</div>
            <div className="blk-sub">Mobilidade especifica</div>
          </div>
          <div className="blk-min">8min</div>
        </div>
        <div className="blk-body">
          <div className="blk-desc">{day.alongamento || "Mobilidade articular completa + alongamento especifico do dia."}</div>
        </div>
      </div>

      <div className="blk">
        <div className="blk-hdr">
          <div className="blk-dot" style={{background:"#00BCD4"}}/>
          <div>
            <div className="blk-ttl">{aq.titulo || "Aquecimento Especifico"}</div>
            <div className="blk-sub">WOD 1 — Aquecimento</div>
          </div>
          <div className="blk-min">10min</div>
        </div>
        <div className="blk-body">
          {aq.movimentos && (
            <div style={{marginBottom:10}}>
              <div className="blk-label">Movimentos</div>
              <div className="blk-desc">{aq.movimentos}</div>
            </div>
          )}
          {aq.strength && (
            <div>
              <div className="blk-label">Strength Work</div>
              <div className="blk-desc">{aq.strength}</div>
            </div>
          )}
        </div>
      </div>

      {day.barbell_cycling && day.barbell_cycling !== "N/A" && (
        <div className="blk">
          <div className="blk-hdr">
            <div className="blk-dot" style={{background:"#9C27B0"}}/>
            <div>
              <div className="blk-ttl">Barbell Cycling / Skill Work</div>
              <div className="blk-sub">Trabalho especifico</div>
            </div>
            <div className="blk-min">15min</div>
          </div>
          <div className="blk-body">
            <div className="blk-desc">{day.barbell_cycling}</div>
          </div>
        </div>
      )}

      <div className="blk">
        <div className="blk-hdr">
          <div className="blk-dot" style={{background:"#FF3D00"}}/>
          <div>
            <div className="blk-ttl">{w.nome || "WOD"}</div>
            <div className="blk-sub">Metcon — WOD Principal</div>
          </div>
          <div className="blk-min">{w.timecap || "—"}</div>
        </div>
        <div className="blk-body">
          <div className="wod-formato">{w.formato}</div>
          <div className="blk-desc">{w.descricao || w.desc || "—"}</div>
          {(w.rx || w.scaled) && (
            <div className="rxsc">
              {w.rx     && <div className="rxb"><div className="rxl">RX</div><div className="rxt">{w.rx}</div></div>}
              {w.scaled && <div className="scb"><div className="scl">SCALED</div><div className="sct">{w.scaled}</div></div>}
            </div>
          )}
          {(w.carga || w.carga_sugerida) && (
            <div className="carga-box">Carga sugerida: {w.carga || w.carga_sugerida}</div>
          )}
          {(w.tip || w.coach_tip) && <div className="tip">{w.tip || w.coach_tip}</div>}
        </div>
      </div>
    </div>
  );
}

const LOAD_MSGS = [
  "Analisando os fundamentos da semana...",
  "Criando aquecimentos especificos...",
  "Montando Strength Work...",
  "Criando WODs variados...",
  "Programando o Sabado em dupla...",
  "Revisando periodizacao...",
  "Quase pronto...",
];

function ProgramPage() {
  const [selF, setSelF]         = useState([]);
  const [selLvl, setSelLvl]     = useState("rx");
  const [selDur, setSelDur]     = useState(60);
  const [program, setProgram]   = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState(null);
  const [msgIdx, setMsgIdx]     = useState(0);
  const [pdfHtml, setPdfHtml]   = useState(null);
  const [copied,  setCopied]    = useState(false);

  // Register setter so exportPDF can call it
  window._setPdfModal = setPdfHtml;

  const toggle = id => selF.includes(id)
    ? setSelF(selF.filter(x=>x!==id))
    : selF.length < 3 ? setSelF([...selF, id]) : null;

  const gen = () => {
    if (!selF.length) { setErr("Selecione ao menos 1 fundamento."); return; }
    setErr(null);
    try {
      const r = generateWeek({fundamentals: selF, level: selLvl, duration: selDur});
      if (!r || !r.dias || r.dias.length === 0) throw new Error("Resultado vazio.");
      setProgram(r);
      setActiveDay(0);
    } catch(e) {
      setErr("Erro: " + String(e.message || e));
    }
  };

  const cats = [...new Set(FUNDAMENTALS.map(f=>f.cat))];
  const lvl  = LEVELS.find(l=>l.id===selLvl);

  if (loading) return (
    <div>
      <div className="ph"><div className="pt">Gerando Semana...</div></div>
      <div className="loading-box">
        <div style={{fontSize:36,marginBottom:12}}>🏋️</div>
        <div className="loading-title">IA montando sua programacao</div>
        <div className="loading-sub">{LOAD_MSGS[msgIdx]}</div>
        <div className="loading-bar"><div className="loading-fill"/></div>
      </div>
    </div>
  );

  if (pdfHtml) {
    var txt = pdfHtml.txt || "";
    var dias = program ? (program.dias || []) : [];
    var copyText = function() {
      try { navigator.clipboard.writeText(txt).then(function(){ setCopied(true); setTimeout(function(){setCopied(false);},2500); }); }
      catch(e) { setCopied(false); }
    };
    return (
      <div style={{position:"fixed",inset:0,zIndex:500,background:"var(--bg)",overflowY:"auto"}}>
        <div style={{padding:"12px 16px",background:"var(--surf)",borderBottom:"1px solid var(--bdr)",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
          <div style={{fontWeight:900,fontSize:15}}>📄 Semana Completa</div>
          <button onClick={()=>setPdfHtml(null)} style={{background:"var(--acc)",border:"none",borderRadius:7,padding:"6px 14px",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer"}}>✕ Fechar</button>
        </div>
        <div style={{padding:"12px 16px 0"}}>
          <button onClick={copyText} style={{width:"100%",padding:"12px",background:copied?"var(--green)":"#2196F3",border:"none",borderRadius:9,color:"#fff",fontWeight:900,fontSize:14,letterSpacing:1,cursor:"pointer",marginBottom:10}}>
            {copied ? "✓ COPIADO! Cole no WhatsApp" : "📋 COPIAR TEXTO PARA WHATSAPP"}
          </button>
          <div style={{background:"#22c55e10",border:"1px solid #22c55e25",borderRadius:8,padding:"9px 12px",fontSize:11,color:"#86efac",marginBottom:12,lineHeight:1.6}}>
            iPhone: Copie o texto → Cole no grupo do box. Para PDF: Compartilhar → Imprimir → Pinça → Compartilhar PDF
          </div>
        </div>
        <div style={{padding:"0 16px 40px"}}>
          {dias.map(function(day, i) {
            var aq = day.aquecimento || {};
            var w  = day.wod || {};
            var isSat = day.short === "SAB";
            return (
              <div key={i} style={{marginBottom:16,borderRadius:12,overflow:"hidden",border:"1px solid var(--bdr)",background:"var(--card)"}}>
                <div style={{background:isSat?"#22c55e22":"var(--acc)",padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                  <div style={{background:"rgba(0,0,0,0.3)",borderRadius:6,padding:"3px 9px",fontWeight:900,fontSize:13,color:"#fff"}}>{day.short}</div>
                  <div style={{fontWeight:800,fontSize:14,color:"#fff"}}>{day.dia}</div>
                  <div style={{marginLeft:"auto",fontSize:10,color:"rgba(255,255,255,0.7)",letterSpacing:1}}>{day.foco}</div>
                </div>
                <div style={{padding:"12px 14px",display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{background:"#22c55e12",borderLeft:"3px solid #22c55e",borderRadius:"0 8px 8px 0",padding:"9px 12px"}}>
                    <div style={{fontSize:9,fontWeight:800,color:"#22c55e",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>ALONGAMENTO — 8min</div>
                    <div style={{fontSize:12,color:"#bcc5d4",lineHeight:1.7,whiteSpace:"pre-line"}}>{day.alongamento||"Mobilidade articular completa."}</div>
                  </div>
                  <div style={{background:"#00BCD412",borderLeft:"3px solid #00BCD4",borderRadius:"0 8px 8px 0",padding:"9px 12px"}}>
                    <div style={{fontSize:9,fontWeight:800,color:"#00BCD4",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>{aq.titulo||"AQUECIMENTO"} — 10min</div>
                    {aq.movimentos&&<div style={{fontSize:11,color:"#7dd3fc",marginBottom:5,fontWeight:600}}>Movimentos: {aq.movimentos}</div>}
                    {aq.strength&&<div style={{fontSize:12,color:"#bcc5d4",lineHeight:1.7,whiteSpace:"pre-line"}}>{aq.strength}</div>}
                  </div>
                  {(!isSat && day.barbell_cycling && day.barbell_cycling!=="N/A") && (
                    <div style={{background:"#9C27B012",borderLeft:"3px solid #9C27B0",borderRadius:"0 8px 8px 0",padding:"9px 12px"}}>
                      <div style={{fontSize:9,fontWeight:800,color:"#c084fc",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>BARBELL CYCLING / SKILL — 15min</div>
                      <div style={{fontSize:12,color:"#bcc5d4",lineHeight:1.7,whiteSpace:"pre-line"}}>{day.barbell_cycling}</div>
                    </div>
                  )}
                  <div style={{background:"#FF3D0012",borderLeft:"3px solid #FF3D00",borderRadius:"0 8px 8px 0",padding:"9px 12px"}}>
                    <div style={{fontSize:9,fontWeight:800,color:"var(--acc)",letterSpacing:2,textTransform:"uppercase",marginBottom:2}}>WOD</div>
                    <div style={{fontWeight:900,fontSize:15,color:"var(--txt)",marginBottom:3}}>{w.nome||"METCON"}</div>
                    <div style={{fontSize:9,fontWeight:700,color:"var(--acc)",letterSpacing:2,marginBottom:7}}>{w.formato}</div>
                    <div style={{fontSize:13,color:"#bcc5d4",lineHeight:1.8,whiteSpace:"pre-line",marginBottom:10}}>{w.descricao||w.desc||""}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                      <div style={{background:"#2196F310",border:"1px solid #2196F325",borderRadius:8,padding:9}}>
                        <div style={{fontSize:9,fontWeight:800,color:"#60a5fa",letterSpacing:2,marginBottom:3}}>RX</div>
                        <div style={{fontSize:11,color:"#bcc5d4"}}>{w.rx||""}</div>
                      </div>
                      <div style={{background:"#FF980010",border:"1px solid #FF980025",borderRadius:8,padding:9}}>
                        <div style={{fontSize:9,fontWeight:800,color:"#fb923c",letterSpacing:2,marginBottom:3}}>SCALED</div>
                        <div style={{fontSize:11,color:"#bcc5d4"}}>{w.scaled||""}</div>
                      </div>
                    </div>
                    {w.carga&&<div style={{marginTop:8,background:"#ffffff08",borderRadius:7,padding:"6px 10px",fontSize:12,color:"var(--sub)"}}>Carga sugerida: {w.carga}</div>}
                    {w.tip&&<div style={{marginTop:8,background:"#FFB30010",border:"1px solid #FFB30022",borderRadius:8,padding:"8px 10px",fontSize:12,color:"var(--acc2)"}}>Coach: {w.tip}</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (program) return (
    <div>
      <div className="ph ph-row">
        <div><div className="pt">Programacao</div><div className="ps">{program.tema}</div></div>
        <button className="small-btn" onClick={()=>setProgram(null)}>Nova</button>
      </div>
      <div className="week-hdr">
        <div className="wt">{program.tema}</div>
        <button
          onClick={()=>exportPDF(program)}
          style={{marginTop:10,width:"100%",padding:"10px 0",background:"#FF3D00",border:"none",borderRadius:8,color:"#fff",fontWeight:900,fontSize:13,letterSpacing:1,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
          📄 EXPORTAR SEMANA EM PDF
        </button>
      </div>
      <div className="day-tabs">
        {(program.dias||[]).map((d,i)=>(
          <button key={i} className={"dt"+(activeDay===i?" on":"")} onClick={()=>setActiveDay(i)}>
            {d.short}
          </button>
        ))}
      </div>
      <DayView day={program.dias?.[activeDay]}/>
    </div>
  );

  return (
    <div>
      <div className="ph"><div className="pt">Programar Semana</div><div className="ps">IA cria WODs no estilo coach real</div></div>
      {selF.length > 0 && (
        <div className="tags">
          {selF.map(id => { const f=FUNDAMENTALS.find(x=>x.id===id); return (
            <div key={id} className="tag">{f.emoji} {f.label}<span className="tag-x" onClick={()=>toggle(id)}>x</span></div>
          );})}
        </div>
      )}
      {cats.map(cat => (
        <div key={cat}>
          <div className="cat-lbl">{cat}</div>
          <div className="fund-grid">
            {FUNDAMENTALS.filter(f=>f.cat===cat).map(f => (
              <div key={f.id}
                className={"fi"+(selF.includes(f.id)?" sel":"")+(selF.length>=3&&!selF.includes(f.id)?" dis":"")}
                onClick={()=>toggle(f.id)}>
                <div className="fi-em">{f.emoji}</div>
                <div className="fi-name">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{height:10}}/>
      <div className="opts">
        <div className="og">
          <label>Nivel</label>
          <div className="pills">
            {LEVELS.map(l=>(
              <div key={l.id} className={"pill"+(selLvl===l.id?" on":"")}
                onClick={()=>setSelLvl(l.id)}
                style={selLvl===l.id?{borderColor:l.color,color:l.color}:{}}>
                {l.label}
              </div>
            ))}
          </div>
          {lvl && <div style={{fontSize:10,color:"var(--sub)",marginTop:5}}>{lvl.sub}</div>}
        </div>
        <div className="og">
          <label>Duracao</label>
          <div className="pills">
            {DURATIONS.map(d=>(
              <div key={d} className={"pill"+(selDur===d?" on":"")} onClick={()=>setSelDur(d)}>{d}min</div>
            ))}
          </div>
        </div>
      </div>
      {err && <div className="err-box">{err}</div>}
      <button className="gen-btn" onClick={gen} disabled={!selF.length || loading}>
        IA GERAR SEMANA COMPLETA
      </button>
      <div style={{padding:"12px 12px 0",fontSize:11,color:"var(--sub)",lineHeight:1.7}}>
        A IA cria WODs unicos no estilo coach real: formatos variados, aquecimento especifico, strength work, barbell cycling e WOD de sabado longo em dupla.
      </div>
    </div>
  );
}

function WodLibrary() {
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const list = useMemo(() => {
    let r = WOD_LIBRARY;
    if (filter !== "Todos") r = r.filter(w=>w.cat===filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(w=>w.name.toLowerCase().includes(q)||w.moves.some(m=>m.toLowerCase().includes(q)));
    }
    return r;
  }, [filter, search]);

  return (
    <div>
      <div className="ph">
        <div className="pt">Biblioteca de WODs</div>
        <div className="ps">{WOD_LIBRARY.length} WODs — Coach Level 4</div>
      </div>
      <input className="search-inp" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar WOD ou movimento..."/>
      <div className="fstrip">
        {WOD_CATS.map(c=><button key={c} className={"fp"+(filter===c?" on":"")} onClick={()=>setFilter(c)}>{c}</button>)}
      </div>
      <div className="sl">{list.length} WODs</div>
      {list.map(w => {
        const color = CAT_CLR[w.cat] || "#aaa";
        return (
          <div key={w.id} className="wcard">
            <div className="wc-top">
              <div className="wc-ico">{w.icon}</div>
              <div><div className="wc-name">{w.name}</div><div className="wc-type">{w.type}</div></div>
              <div className="wc-cat" style={{background:color+"22",color}}>{w.cat}</div>
            </div>
            <div className="wc-body">
              <div className="wc-moves">{w.moves.map((m,i)=><div key={i} className="wc-move">{m}</div>)}</div>
              <div className="wc-meta">
                <div className="wc-reps">{w.reps}</div>
                <div className="wc-tc">TC {w.tc}</div>
              </div>
              <div className="rxsc" style={{marginTop:8}}>
                <div className="rxb"><div className="rxl">RX</div><div className="rxt">{w.rx}</div></div>
                <div className="scb"><div className="scl">SCALED</div><div className="sct">{w.scaled}</div></div>
              </div>
              <div className="wc-desc">{w.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OpenLibrary() {
  const [filter, setFilter] = useState("Todos");
  const list = useMemo(()=>filter==="Todos"?OPEN_WODS:OPEN_WODS.filter(w=>String(w.year)===filter),[filter]);
  return (
    <div>
      <div className="ph">
        <div className="pt">Open CrossFit Games</div>
        <div className="ps">{OPEN_WODS.length} WODs — 2015 a 2024</div>
      </div>
      <div className="fstrip">
        {OPEN_YEARS.map(y=><button key={y} className={"fp"+(filter===y?" on":"")} onClick={()=>setFilter(y)}>{y}</button>)}
      </div>
      <div className="sl">{list.length} WODs</div>
      {list.map(w => (
        <div key={w.num} className="ocard">
          <div className="oc-top">
            <div className="oc-ico">{w.icon}</div>
            <div><div className="oc-num">{w.num}</div><div className="oc-type">{w.type}</div></div>
            <div className="oc-year">{w.year}</div>
          </div>
          <div className="oc-body">
            <div className="oc-desc">{w.desc}</div>
            <div className="oc-rxsc">
              <div className="rxb"><div className="rxl">RX</div><div className="rxt">{w.rx}</div></div>
              <div className="scb"><div className="scl">SCALED</div><div className="sct">{w.scaled}</div></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


// ─── USUÁRIOS ATIVOS ─────────────────────────────────────────
// Em producao: estes usuarios vem do Firebase/banco de dados
// Hotmart webhook cria automaticamente quando cliente compra
const USERS_DB = [
  {email:"coach@demo.com",     pass:"coach2025",  name:"Coach Demo",    plan:"Pro",  status:"active"},
  {email:"demo",               pass:"demo",        name:"Demo BoxCode",  plan:"Pro",  status:"active"},
  // Adicione clientes manualmente aqui ate ter o Firebase configurado:
  // {email:"cliente@email.com", pass:"senhaGerada", name:"Nome Box", plan:"Pro", status:"active"},
];


function LoginPage({onLogin}) {
  const [email, setEmail]   = useState("");
  const [pass,  setPass]    = useState("");
  const [err,   setErr]     = useState("");
  const [load,  setLoad]    = useState(false);

  const login = () => {
    if (!email || !pass) { setErr("Preencha email e senha."); return; }
    setLoad(true); setErr("");
    setTimeout(() => {
      const u = USERS_DB.find(x =>
        x.email.toLowerCase() === email.toLowerCase().trim() && x.pass === pass
      );
      if (!u) {
        setErr("Email ou senha incorretos.\nDúvidas? Contate o suporte.");
        setLoad(false); return;
      }
      if (u.status === "cancelled") {
        setErr("Assinatura cancelada. Renove para recuperar o acesso.");
        setLoad(false); return;
      }
      if (u.status === "suspended") {
        setErr("Pagamento pendente. Regularize pelo Hotmart.");
        setLoad(false); return;
      }
      try { localStorage.setItem("bc_sess", JSON.stringify(u)); } catch(e) {}
      onLogin(u);
      setLoad(false);
    }, 600);
  };

  const demo = () => { setEmail("demo"); setPass("demo"); setTimeout(login, 100); };

  return (
    <>
      <div className="lw">
        <div className="lc">
          <div className="ll">BOX<span>CODE</span></div>
          <div className="lb2">COACH LEVEL 4</div>
          <div className="lf">
            <label>Email ou usuario</label>
            <input value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="seu@email.com"
              onKeyDown={e=>e.key==="Enter"&&login()}/>
          </div>
          <div className="lf">
            <label>Senha</label>
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e=>e.key==="Enter"&&login()}/>
          </div>
          <button className="lbtn" onClick={login} disabled={load}>
            {load ? "ENTRANDO..." : "ACESSAR"}
          </button>
          {err && <div className="lerr">{err}</div>}
          <div className="lfgt">Esqueci minha senha</div>
          <div className="ldiv"/>
          <button className="ldemo" onClick={demo}>Entrar com conta demo</button>
          <div className="lplan">
            Nao tem acesso? Assine em{" "}
            <span style={{color:"#FF3D00"}}>boxcode.app</span>{" "}
            por R$197/mes ou R$100 (fundadores).
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  // ── ALL HOOKS AT TOP (React rules) ───────────────────────────
  const [user, setUser] = useState(() => {
    try { const s = localStorage.getItem("bc_sess"); return s ? JSON.parse(s) : null; }
    catch(e) { return null; }
  });
  const [tab, setTab] = useState("programar");

  const logout = () => {
    try { localStorage.removeItem("bc_sess"); } catch(e) {}
    setUser(null);
  };

  const NAV = [
    {id:"programar", icon:"⚡", label:"Programar"},
    {id:"semana",    icon:"📅", label:"Semana"},
    {id:"wods",      icon:"🏋️",label:"WODs"},
    {id:"open",      icon:"🏆", label:"Open"},
  ];

  const loginCSS = ` .lw{min-height:100vh;display:flex;align-items:center;justify-content:center;   background:radial-gradient(ellipse 500px 400px at 50% 0%,#FF3D0018,transparent 60%),#090a0f;   padding:20px;} .lc{width:100%;max-width:340px;background:#13141b;border:1px solid #ffffff12;   border-radius:20px;padding:32px 24px;text-align:center;} .ll{font-family:system-ui;font-size:38px;font-weight:900;letter-spacing:2px;margin-bottom:5px;} .ll span{color:#FF3D00;} .lb2{display:inline-block;background:linear-gradient(135deg,#7C3AED,#2563eb);border-radius:20px;   padding:3px 12px;font-size:9px;font-weight:700;letter-spacing:2px;color:#fff;margin-bottom:26px;} .lf{margin-bottom:12px;text-align:left;} .lf label{display:block;font-size:9px;letter-spacing:2px;text-transform:uppercase;   color:#6b7a99;font-weight:700;margin-bottom:5px;} .lf input{width:100%;padding:12px 14px;background:#1a1c25;border:1.5px solid #ffffff10;   border-radius:9px;color:#eeeef5;font-family:system-ui;font-size:14px;outline:none;} .lf input:focus{border-color:#FF3D0050;} .lbtn{width:100%;padding:14px;margin-top:4px;background:#FF3D00;border:none;   border-radius:9px;color:#fff;font-weight:900;font-size:15px;letter-spacing:2px;   cursor:pointer;font-family:system-ui;} .lbtn:disabled{opacity:.5;} .lerr{color:#f87171;font-size:12px;margin-top:10px;padding:8px 12px;   background:#ef444415;border-radius:7px;text-align:left;line-height:1.5;} .lfgt{color:#4a5070;font-size:11px;margin-top:12px;cursor:pointer;text-decoration:underline;} .ldiv{margin:18px 0;border-top:1px solid #ffffff08;} .ldemo{width:100%;padding:11px;background:transparent;border:1px solid #ffffff12;   border-radius:9px;color:#8892a4;font-size:12px;cursor:pointer;font-family:system-ui;} .ldemo:hover{background:#1a1c25;color:#fff;} .lplan{margin-top:16px;padding:10px 12px;background:#FF3D0010;border:1px solid #FF3D0025;   border-radius:8px;font-size:11px;color:#FF9980;line-height:1.6;} `;

  // ── LOGIN ────────────────────────────────────────────────────
  if (!user) return (
    <>
      <style>{CSS}</style>
      <style>{loginCSS}</style>
      <LoginPage onLogin={setUser}/>
    </>
  );

  // ── APP PRINCIPAL ────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <style>{loginCSS}</style>
      <div className="app">
        <div className="topbar">
          <div className="brand">BOX<span>CODE</span></div>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <div className="pro-badge">{user.plan}</div>
            <button onClick={logout}
              style={{background:"none",border:"1px solid #ffffff15",borderRadius:7,
                padding:"4px 9px",color:"#4a5070",fontSize:10,cursor:"pointer"}}>
              Sair
            </button>
          </div>
        </div>
        {tab==="programar" && <ProgramPage/>}
        {tab==="semana"    && (
          <div className="empty">
            <div className="empty-ico">📅</div>
            <div className="empty-ttl">Va em Programar</div>
            <div style={{fontSize:13,color:"var(--sub)",marginTop:6}}>Selecione os fundamentos e gere a semana completa.</div>
          </div>
        )}
        {tab==="wods"      && <WodLibrary/>}
        {tab==="open"      && <OpenLibrary/>}
        <nav className="nav">
          {NAV.map(n=>(
            <button key={n.id} className={"ni"+(tab===n.id?" on":"")} onClick={()=>setTab(n.id)}>
              <span className="ni-icon">{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
