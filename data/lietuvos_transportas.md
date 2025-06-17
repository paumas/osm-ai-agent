# Viešojo transporto žymėjimas Lietuvoje

## Autobusų maršrutai

### Miesto transportas
- `route=bus` - autobusų maršrutai
- `ref` - maršruto numeris (pvz., "1", "2G")
- `operator` - pervežėjas

### Vilniaus transportas
- Vilniaus viešasis transportas: `operator=Susisiekimo paslaugos`
- Autobusai: `route=bus`
- Troleibusai: `route=trolleybus`

### Kauno transportas
- Kauno viešasis transportas: `operator=Kauno viešasis transportas`

## Stotelės

### Autobusų stotelės
- `highway=bus_stop` - autobusų stotelė
- `name` - stotelės pavadinimas lietuviškai
- `shelter=yes/no` - ar yra stoginė

### Pavyzdys Vilniuje
```
highway=bus_stop
name=Katedros aikštė
shelter=yes
operator=Susisiekimo paslaugos
```

## Geležinkeliai

### Stotys
- `railway=station` - geležinkelio stotys
- `name` - stoties pavadinimas
- `operator=Lietuvos geležinkeliai`

### Bėgiai
- `railway=rail` - pagrindiniai bėgiai
- `gauge=1520` - Lietuvos geležinkelių vėžė (platoji vėžė)

## Oro uostai

### Vilniaus oro uostas
- `aeroway=aerodrome`
- `name=Vilniaus oro uostas`
- `iata=VNO`
- `icao=EYVI`

Šaltinis: Lietuvos susisiekimo ministerijos duomenys