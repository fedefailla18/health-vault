# HealthVault — Documento Maestro v0.1

> Este documento es la guía fundacional del proyecto. Su objetivo es centralizar el conocimiento, la arquitectura, los datos históricos y la estrategia tecnológica para construir un sistema personal de inteligencia longitudinal enfocado en salud, entrenamiento, lesiones, biomarcadores y bienestar.

---

# 1. Visión

HealthVault es un sistema personal de inteligencia longitudinal que permite:

* Almacenar información médica histórica.
* Registrar entrenamiento y rendimiento.
* Registrar lesiones y recuperación.
* Registrar medicación y suplementación.
* Mantener una memoria persistente durante años.
* Analizar tendencias.
* Detectar patrones.
* Asistir en la toma de decisiones relacionadas con salud y rendimiento.

No pretende reemplazar médicos ni realizar diagnósticos.

Su objetivo es proporcionar contexto histórico y análisis.

---

# 2. Filosofía

## Local First

Los datos pertenecen al usuario.

## Human in the Loop

La IA asiste.
El usuario decide.
Los profesionales validan.

## Longitudinalidad

El valor está en la evolución durante años.

## Trazabilidad

Toda información debe poder rastrearse a una fuente.

## Simplicidad

Markdown > Complejidad innecesaria.

---

# 3. Arquitectura Inicial

```text
Google Drive
        │
        ▼
 HealthVault Repository
        │
        ▼
      Git
        │
        ▼
    Obsidian
        │
        ▼
     SQLite
        │
        ▼
     Vector DB
        │
        ▼
      LLM
```

---

# 4. Tecnologías Propuestas

## Fase Inicial

* Google Drive
* VS Code o Cursor
* Git
* Obsidian

## Fase Intermedia

* SQLite
* Python

## Fase Avanzada

* Ollama
* OpenWebUI
* LanceDB o ChromaDB
* RAG

---

# 5. Estructura de Carpetas

```text
HealthVault/

README.md

data/
    user_profile.csv
    body_metrics.csv
    training_log.csv
    injuries.csv
    medications.csv
    labs.csv

studies/
    MRI/
    Bloodwork/
    Reports/

prompts/
    system_prompt.md

scripts/

exports/
```

---

# 6. Google Drive

Google Drive actuará como:

* almacenamiento de PDFs
* almacenamiento de resonancias
* almacenamiento de análisis clínicos
* backup del repositorio

Conceptualmente:

```text
Google Drive ≈ AWS S3 simplificado
```

---

# 7. Integraciones Futuras

## Google Drive API

Permitir:

* subir estudios automáticamente
* indexar PDFs
* leer carpetas

## Google Sheets API

Permitir:

* cargar peso
* cargar entrenamientos
* cargar biomarcadores

## GitHub

Permitir:

* versionado
* backups
* colaboración futura

---

# 8. Información Histórica Recuperada

## Datos Personales

| Campo       | Valor              |
| ----------- | ------------------ |
| Sexo        | Masculino          |
| Edad        | 36 años            |
| Altura      | 174 cm             |
| Peso actual | 77.5 kg            |
| Profesión   | Desarrollador Java |
| Intereses   | Trading            |

---

# 9. Actividad Física Actual

## Gimnasio

Inicio aproximado:

2024

Objetivo:

* Fuerza
* Mantener volumen moderado
* Prevención de lesiones

Frecuencia:

3-4 veces por semana

---

## Fútbol

Frecuencia:

1 vez por semana

---

## Pádel

Frecuencia:

2 veces por mes

---

## Caminatas

Frecuencia:

3-4 veces por semana

Duración:

20-30 minutos

---

# 10. Lesiones Registradas

## Hombro Derecho

Fecha:

19/10/2022

RMN

Resultado:

* Tendinosis del supraespinoso
* Rotura parcial bursal
* Tamaño: 9x9 mm
* Manguito restante conservado
* Bíceps conservado
* Bursa subacromial con pequeño líquido
* Trofismo muscular conservado

Estado actual:

Funcional.
Entrenamiento de fuerza mantenido.

Fuente:
RMN hombro derecho 2022. 

---

## Recto Femoral

Antecedentes:

Lesión previa con recaídas ocasionales.

Último episodio:

Durante partido de fútbol.

Mecanismo:

Carrera máxima + golpeo + aterrizaje.

Síntomas:

* Dolor localizado
* Sin limitación importante para caminar

---

# 11. Medicación

## Sertralina

Inicio:

Septiembre 2025

Dosis:

(No registrada)

Motivo:

(No registrado)

---

# 12. Análisis Clínicos Recuperados

## Vitamina D

2024

Resultado:

12 ng/ml

Interpretación:

Deficiencia.

Acciones posteriores:

* Suplementación
* Mayor exposición solar
* Ejercicio regular

Estado actual:

Pendiente de nuevo control.

---

## Cortisol Matinal

Resultado:

16.5 ug/dl

VR:

3.7 - 19.4 ug/dl

Interpretación:

Dentro de rango.

---

## Zinc

Resultado:

0.70 ug/ml

Normal.

---

## Selenio

Resultado:

110 ng/ml

Normal.

---

## Testosterona

Resultado:

Normal.

---

## Función tiroidea

Normal.

---

## Glucemia

92 mg/dl

Normal.

---

## HbA1c

5.4 %

Normal.

---

# 13. Rendimiento de Fuerza Registrado

## Sentadilla

90 kg x 4 reps

---

## Press Inclinado

75 kg x 4 reps

---

## Remo Polea

75 kg x 4 reps

---

# 14. Sistema de Registro Propuesto

## Google Sheet 1

body_metrics

Columnas:

```csv
date,weight_kg,body_fat_pct,muscle_mass_kg,visceral_fat,bmr,notes
```

---

## Google Sheet 2

training_log

```csv
date,activity,type,duration_min,intensity,rpe,notes
```

---

## Google Sheet 3

strength_log

```csv
date,exercise,weight,reps,sets,rpe
```

---

## Google Sheet 4

injuries

```csv
date,body_region,severity,status,description
```

---

## Google Sheet 5

labs

```csv
date,test_name,result,unit,reference_range,comments
```

---

## Google Sheet 6

medications

```csv
date_start,date_end,drug,dose,reason,notes
```

---

# 15. CSV Iniciales

## user_profile.csv

```csv
name,age,height_cm,weight_kg
Federico,36,174,77.5
```

---

## injuries.csv

```csv
date,body_region,diagnosis,status
2022-10-19,right_shoulder,supraspinatus_tendinosis_partial_bursal_tear,active_history
2026-05-11,rectus_femoris,reaggravation,monitoring
```

---

## medications.csv

```csv
date_start,date_end,drug,dose
2025-09-01,,sertraline,unknown
```

---

# 16. Rol del Agente

El agente deberá:

* Organizar información.
* Detectar patrones.
* Analizar tendencias.
* Generar reportes.
* Comparar períodos.
* Mantener memoria histórica.

No deberá:

* Diagnosticar.
* Prescribir tratamientos.
* Sustituir profesionales sanitarios.

---

# 17. Preguntas que el Sistema Debe Poder Responder

## Salud

* ¿Cómo evolucionó mi peso?
* ¿Cómo evolucionó mi vitamina D?
* ¿Qué lesiones tuve?

## Entrenamiento

* ¿Cuándo fui más fuerte?
* ¿Cómo progresó mi sentadilla?

## Recuperación

* ¿Existe relación entre lesiones y volumen de entrenamiento?
* ¿Existe relación entre sueño y molestias?

## Biomarcadores

* ¿Cómo evolucionaron testosterona y cortisol?

---

# 18. Próximos Pasos Técnicos

## Paso 1

Crear repositorio:

```bash
git init HealthVault
```

---

## Paso 2

Crear Google Drive:

```text
/HealthVault
```

---

## Paso 3

Crear Obsidian Vault:

```text
HealthVault
```

---

## Paso 4

Crear Google Sheets:

* body_metrics
* training_log
* strength_log
* injuries
* labs
* medications

---

## Paso 5

Crear agente constructor

Objetivo:

* leer este README
* generar automáticamente:

  * carpetas
  * CSV
  * Google Sheets
  * estructura del proyecto
  * integración Drive API

---

# 19. Perfil Deseado del Tecnólogo

Buscar alguien con experiencia en:

* AI Product Engineering
* RAG
* Python
* Obsidian
* Vector Databases
* LangGraph
* OpenAI API
* Ollama

No es necesario que sea médico.

Es más importante que entienda:

* sistemas de conocimiento
* memoria persistente
* arquitectura de agentes

---

# 20. Principio Rector

> El valor del sistema no está en responder preguntas médicas aisladas.
>
> El valor está en construir una memoria longitudinal capaz de relacionar lesiones, biomarcadores, entrenamiento, medicación, recuperación y contexto vital durante años para ayudar a tomar mejores decisiones.
