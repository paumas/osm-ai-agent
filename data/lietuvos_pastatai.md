# Pastatų žymėjimas Lietuvoje

## Pastatų tipai

### Gyvenamieji pastatai
- `building=apartments` - daugiabučiai namai
- `building=house` - individualūs namai
- `building=detached` - atskiri namai

### Viešieji pastatai
- `building=school` - mokyklos
- `building=hospital` - ligoninės
- `building=church` - bažnyčios
- `building=commercial` - prekybos centrai

## Lietuvos specifika

### Sovietmečio pastatai
- Tipiniai sovietmečio daugiabučiai: `building=apartments` + `architect=tipinis_projektas`
- Chruščiovkės: `building:levels=5`

### Mediniai namai
- Tradiciniai mediniai namai: `building:material=wood`
- Ypač aktualu kaimo vietovėms

### Bažnyčios
- Katalikų bažnyčios: `building=church` + `religion=christian` + `denomination=catholic`
- Stačiatikių cerkvės: `building=church` + `religion=christian` + `denomination=orthodox`

Šaltinis: Lietuvos statybos taisyklės ir OSM praktika