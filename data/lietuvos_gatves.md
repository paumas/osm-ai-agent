# Lietuvos gatvių žymėjimas OpenStreetMap

## Gatvių pavadinimai

### Taisyklės
- Gatvės pavadinimas rašomas lietuvių kalba be genetivo galūnės
- Naudojamas `name` tag'as lietuviškai
- `name:en` tag'as angliškai (jei reikia)

### Pavyzdžiai
- ✅ Gedimino prospektas (ne "Gedimino prospekto")
- ✅ Vilniaus gatvė (ne "Vilniaus gatvės")
- ✅ Konstitucijos prospektas

### Gatvių tipai Lietuvoje
- `highway=primary` - magistraliniai keliai (A keliai)
- `highway=secondary` - krašto keliai (KK keliai)
- `highway=tertiary` - rajonų keliai
- `highway=residential` - gyvenamųjų rajonų gatvės
- `highway=service` - privažiavimo keliai

## Adresų numeracija

### name tag'ai adresams
- `addr:housenumber` - namo numeris
- `addr:street` - gatvės pavadinimas (be genetivo!)
- `addr:city` - miestas
- `addr:postcode` - pašto indeksas

### Pavyzdys
```
addr:housenumber=15
addr:street=Gedimino prospektas
addr:city=Vilnius  
addr:postcode=01103
```

## Lietuvos ypatumai

### Senamiestis
- Vilniaus senamiestis: naudoti `historic=yes`
- Senos gatvės: pridėti `surface=cobblestone` jei grįstos akmenimis

### Sovietmečio gatvės
- Kai kurios gatvės turi istorinius pavadinimus `old_name` tag'e
- Visada naudoti dabartinius oficilius pavadinimus

Šaltinis: Lietuvos OSM bendruomenės praktika