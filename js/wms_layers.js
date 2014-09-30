var wms = [
{url:"http://wms.cuzk.cz/wms.asp?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap",
 name:"Old WMS ČÚZK",
 layers:"prehledka_kat_prac,dalsi_p_mapy,hranice_parcel,obrazy_parcel,parcelni_cisla,prehledka_kat_uz,prehledka_kraju-linie,RST_KMD,RST_KN",
 layersName:"old"
},
{url:"http://services.cuzk.cz/wms/local-ux-wms.asp?service=WMS&version=1.3.0&request=getMap&CRS=EPSG:102066",
 name:"Units eXtended",
 layers:"UX.RegionSoudrznosti.UnitLabel,UX.RegionSoudrznosti.Boundary,UX.ZSJ.UnitLabel,UX.ZSJ.Boundary,UX.MOMC.UnitLabel,UX.MOMC.Boundary",
 layersName:"UX*"
},
{url:"http://geoportal.cuzk.cz/WMS_ZM50_PUB/wmservice.aspx?service=WMS&version=1.3.0&request=getMap&CRS=EPSG:5514",
 name:"WMS_ZM50_PUB",
 layers:"GR_ZM50",
 layersName:"Základní mapa 1:50 000"
},
{url:"http://geoportal.cuzk.cz/WMS_ZM10_PUB/wmservice.aspx?service=WMS&version=1.3.0&request=getMap&CRS=EPSG:5514",
 name:"WMS_ZM10_PUB",
 layers:"GR_ZM10",
 layersName:"Základní mapa 1:10 000"
},
{url:"http://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/wmservice.aspx?service=WMS&version=1.3.0&request=getMap&CRS=EPSG:5514",
 name:"Ortofoto",
 layers:"GR_ORTFOTORGB",
 layersName:"Ortofoto"
}
]



