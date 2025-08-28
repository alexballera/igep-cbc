# Instrucciones para GitHub Copilot - IGEP CBC UBA

**LEER PRIMERO**: Consulta las instrucciones completas en: `INSTRUCCIONES_AGENTE.md`

**IMPORTANTE**: Responde SIEMPRE en español latinoamericano.

## Resumen Ejecutivo:
- Repositorio educativo de IGEP (Ciencias Políticas UBA)
- Estructura: `sesiones/sesionN/` con lecturas, resúmenes, cuestionarios
- Cuestionarios: HTML + Tailwind CSS + JavaScript vanilla
- Todo contenido en español latinoamericano
- Formato académico universitario para estudiantes de Economía

## Patrón de Cuestionarios:
```javascript
{
    question: "Texto de la pregunta",
    options: ["Opción A", "Opción B", "Opción C", "Opción D"],
    answer: 1, // Respuesta correcta indexada desde cero
    explanation: "Explicación detallada referenciando material fuente"
}
```

## Convenciones:
- Archivos de sesiones: `sesionN/`
- Cuestionarios: `index.html` por sesión
- Todo en español latinoamericano
- Referencias académicas apropiadas