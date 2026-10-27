# Rutas sala por sala

Los números entre paréntesis son IDs internos para depuración; en el juego se muestran las etiquetas regionales. Todas las flechas son reversibles salvo las puertas de reliquia o sello indicadas.

## Ciudades y prólogo

```text
Villa 01/06 (-2) -> Villa 02/06 (-1) | oeste: Villa 04/06 (31)
Villa 02/06 (-1) -> Villa 03/06 (0) | oeste: Villa 01/06 (-2)
Villa 03/06 (0) -> Ceniza 01/08 (101) | oeste: Villa 02/06 (-1)
Villa 04/06 (31) -> Villa 05/06 (32) | este: Villa 01/06 (-2)
Villa 05/06 (32) -> Villa 06/06 (33) | este: Villa 04/06 (31)
Villa 06/06 (33) -> Reloj 01/30 de acceso (46), requiere Doble Salto | este: Villa 05/06 (32)
Ceniza 01/08 (101) -> Ceniza 02/08 (102) | salida alta: Carmesí 01/30 (1), requiere 3 sellos
Ceniza 02/08 (102) -> Ceniza 03/08 (103) | oeste: Ceniza 01/08 (101)
Ceniza 03/08 (103) -> Ceniza 04/08 (104) | oeste: Ceniza 02/08 (102)
Ceniza 04/08 (104) -> Ceniza 05/08 (105) | reliquia: Dash | oeste: Ceniza 03/08 (103)
Ceniza 05/08 (105) -> Ceniza 06/08 (106) | oeste: Ceniza 04/08 (104)
Ceniza 06/08 (106) -> Ceniza 07/08 (107) | altar | oeste: Ceniza 05/08 (105)
Ceniza 07/08 (107) -> Ceniza 08/08 (108) | oeste: Ceniza 06/08 (106)
Ceniza 08/08 (108) -> Enclave 01/01 (9) | oeste: Ceniza 07/08 (107)
Enclave 01/03 (9) -> Jura 01/05 de acceso (41), requiere Dash | este: Ceniza 08/08 (108) | ala alta: Enclave 02/03 (34)
Enclave 02/03 (34) -> Enclave 03/03 (35) | este: Enclave 01/03 (9)
Enclave 03/03 (35) -> Enclave 02/03 (34)
Santuario 01/03 (10) -> Astro 01/05 de acceso (51), requiere Salto en Pared | este: Reloj 30/30 (16) | ala alta: Santuario 02/03 (36)
Santuario 02/03 (36) -> Santuario 03/03 (37) | oeste: Santuario 01/03 (10)
Santuario 03/03 (37) -> Santuario 02/03 (36)
```

## Corredores entre ciudad y fortaleza

```text
Jura 01/05 (41) -> Jura 02/05 (42) | este: Enclave 01/03 (9)
Jura 02/05 (42) -> Jura 03/05 (43)
Jura 03/05 (43) -> Jura 04/05 (44) | altar
Jura 04/05 (44) -> Jura 05/05 (45)
Jura 05/05 (45) -> Juramento 01/30 (201)
Reloj 01/05 (46) -> Reloj 02/05 (47) | este: Villa 06/06 (33)
Reloj 02/05 (47) -> Reloj 03/05 (48)
Reloj 03/05 (48) -> Reloj 04/05 (49) | altar
Reloj 04/05 (49) -> Reloj 05/05 (50)
Reloj 05/05 (50) -> Reloj 01/30 de fortaleza (15)
Astro 01/05 (51) -> Astro 02/05 (52) | este: Santuario 01/03 (10)
Astro 02/05 (52) -> Astro 03/05 (53)
Astro 03/05 (53) -> Astro 04/05 (54) | altar
Astro 04/05 (54) -> Astro 05/05 (55)
Astro 05/05 (55) -> Astral 01/30 de fortaleza (501)
```

## Catacumbas del Juramento — 30 salas

```text
Juramento 01/30 (201) -> Juramento 02/30 (202)
Juramento 02/30 (202) -> Juramento 03/30 (203)
Juramento 03/30 (203) -> Juramento 04/30 (204)
Juramento 04/30 (204) -> Juramento 05/30 (205)
Juramento 05/30 (205) -> Juramento 06/30 (206)
Juramento 06/30 (206) -> Juramento 07/30 (207)
Juramento 07/30 (207) -> Juramento 08/30 (208)
Juramento 08/30 (208) -> Juramento 09/30 (209)
Juramento 09/30 (209) -> Juramento 10/30 (210)
Juramento 10/30 (210) -> Juramento 11/30 (211)
Juramento 11/30 (211) -> Juramento 12/30 (212)
Juramento 12/30 (212) -> Juramento 13/30 (213)
Juramento 13/30 (213) -> Juramento 14/30 (214) | reliquia: Doble Salto
Juramento 14/30 (214) -> Juramento 15/30 (215)
Juramento 15/30 (215) -> Juramento 16/30 (216)
Juramento 16/30 (216) -> Juramento 17/30 (217)
Juramento 17/30 (217) -> Juramento 18/30 (218)
Juramento 18/30 (218) -> Juramento 19/30 (219)
Juramento 19/30 (219) -> Juramento 20/30 (220)
Juramento 20/30 (220) -> Juramento 21/30 (221)
Juramento 21/30 (221) -> Juramento 22/30 (222)
Juramento 22/30 (222) -> Juramento 23/30 (223)
Juramento 23/30 (223) -> Juramento 24/30 (224)
Juramento 24/30 (224) -> Juramento 25/30 (11)
Juramento 25/30 (11) -> Juramento 26/30 (18)
Juramento 26/30 (18) -> Juramento 27/30 (19)
Juramento 27/30 (19) -> Juramento 28/30 (20)
Juramento 28/30 (20) -> Juramento 29/30 (28)
Juramento 29/30 (28) -> Juramento 30/30 (12)
Juramento 30/30 (12) -> regreso por Juramento 29/30 (28) | jefe: Abadesa Ahogada | sello: Juramento
```

## Jardines del Reloj Muerto — 30 salas

```text
Reloj 01/30 (15) -> Reloj 02/30 (401)
Reloj 02/30 (401) -> Reloj 03/30 (402)
Reloj 03/30 (402) -> Reloj 04/30 (403)
Reloj 04/30 (403) -> Reloj 05/30 (404)
Reloj 05/30 (404) -> Reloj 06/30 (405)
Reloj 06/30 (405) -> Reloj 07/30 (406)
Reloj 07/30 (406) -> Reloj 08/30 (407)
Reloj 08/30 (407) -> Reloj 09/30 (408)
Reloj 09/30 (408) -> Reloj 10/30 (409)
Reloj 10/30 (409) -> Reloj 11/30 (410)
Reloj 11/30 (410) -> Reloj 12/30 (411)
Reloj 12/30 (411) -> Reloj 13/30 (412)
Reloj 13/30 (412) -> Reloj 14/30 (413)
Reloj 14/30 (413) -> Reloj 15/30 (414) | reliquia: Salto en Pared
Reloj 15/30 (414) -> Reloj 16/30 (415)
Reloj 16/30 (415) -> Reloj 17/30 (416)
Reloj 17/30 (416) -> Reloj 18/30 (417)
Reloj 18/30 (417) -> Reloj 19/30 (418)
Reloj 19/30 (418) -> Reloj 20/30 (419)
Reloj 20/30 (419) -> Reloj 21/30 (420)
Reloj 21/30 (420) -> Reloj 22/30 (421)
Reloj 22/30 (421) -> Reloj 23/30 (422)
Reloj 23/30 (422) -> Reloj 24/30 (423)
Reloj 24/30 (423) -> Reloj 25/30 (424)
Reloj 25/30 (424) -> Reloj 26/30 (24)
Reloj 26/30 (24) -> Reloj 27/30 (25)
Reloj 27/30 (25) -> Reloj 28/30 (26)
Reloj 28/30 (26) -> Reloj 29/30 (30)
Reloj 29/30 (30) -> Reloj 30/30 (16)
Reloj 30/30 (16) -> Santuario 01/01 (10) | jefe: Guardián Cronista | sello: Reloj
```

## Observatorio Quebrado — 30 salas

```text
Astral 01/30 (501) -> Astral 02/30 (502)
Astral 02/30 (502) -> Astral 03/30 (503)
Astral 03/30 (503) -> Astral 04/30 (504)
Astral 04/30 (504) -> Astral 05/30 (505)
Astral 05/30 (505) -> Astral 06/30 (506)
Astral 06/30 (506) -> Astral 07/30 (507)
Astral 07/30 (507) -> Astral 08/30 (508)
Astral 08/30 (508) -> Astral 09/30 (509)
Astral 09/30 (509) -> Astral 10/30 (510)
Astral 10/30 (510) -> Astral 11/30 (511)
Astral 11/30 (511) -> Astral 12/30 (512)
Astral 12/30 (512) -> Astral 13/30 (513)
Astral 13/30 (513) -> Astral 14/30 (514)
Astral 14/30 (514) -> Astral 15/30 (515)
Astral 15/30 (515) -> Astral 16/30 (516)
Astral 16/30 (516) -> Astral 17/30 (517)
Astral 17/30 (517) -> Astral 18/30 (518)
Astral 18/30 (518) -> Astral 19/30 (519)
Astral 19/30 (519) -> Astral 20/30 (520)
Astral 20/30 (520) -> Astral 21/30 (521)
Astral 21/30 (521) -> Astral 22/30 (522)
Astral 22/30 (522) -> Astral 23/30 (523)
Astral 23/30 (523) -> Astral 24/30 (524)
Astral 24/30 (524) -> Astral 25/30 (13)
Astral 25/30 (13) -> Astral 26/30 (21)
Astral 26/30 (21) -> Astral 27/30 (22)
Astral 27/30 (22) -> Astral 28/30 (23)
Astral 28/30 (23) -> Astral 29/30 (29)
Astral 29/30 (29) -> Astral 30/30 (14)
Astral 30/30 (14) -> regreso por Astral 29/30 (29) | jefe: Serafín de Cristal | sello: Astral
```

## Fortaleza Carmesí — 30 salas

```text
Carmesí 01/30 (1) -> Carmesí 02/30 (1001)
Carmesí 02/30 (1001) -> Carmesí 03/30 (1002)
Carmesí 03/30 (1002) -> Carmesí 04/30 (1003)
Carmesí 04/30 (1003) -> Carmesí 05/30 (1004)
Carmesí 05/30 (1004) -> Carmesí 06/30 (1005)
Carmesí 06/30 (1005) -> Carmesí 07/30 (1006)
Carmesí 07/30 (1006) -> Carmesí 08/30 (1007)
Carmesí 08/30 (1007) -> Carmesí 09/30 (1008)
Carmesí 09/30 (1008) -> Carmesí 10/30 (1009)
Carmesí 10/30 (1009) -> Carmesí 11/30 (1010)
Carmesí 11/30 (1010) -> Carmesí 12/30 (1011)
Carmesí 12/30 (1011) -> Carmesí 13/30 (1012)
Carmesí 13/30 (1012) -> Carmesí 14/30 (1013)
Carmesí 14/30 (1013) -> Carmesí 15/30 (1014)
Carmesí 15/30 (1014) -> Carmesí 16/30 (1015)
Carmesí 16/30 (1015) -> Carmesí 17/30 (1016)
Carmesí 17/30 (1016) -> Carmesí 18/30 (1017)
Carmesí 18/30 (1017) -> Carmesí 19/30 (1018)
Carmesí 19/30 (1018) -> Carmesí 20/30 (1019)
Carmesí 20/30 (1019) -> Carmesí 21/30 (1020)
Carmesí 21/30 (1020) -> Carmesí 22/30 (2)
Carmesí 22/30 (2) -> Carmesí 23/30 (3)
Carmesí 23/30 (3) -> Carmesí 24/30 (6)
Carmesí 24/30 (6) -> Carmesí 25/30 (7)
Carmesí 25/30 (7) -> Carmesí 26/30 (4)
Carmesí 26/30 (4) -> Carmesí 27/30 (8)
Carmesí 27/30 (8) -> Carmesí 28/30 (27)
Carmesí 28/30 (27) -> Carmesí 29/30 (17)
Carmesí 29/30 (17) -> Carmesí 30/30 (5), requiere 4 sellos | jefe: Caballero del Eclipse | sello: Carmesí
Carmesí 30/30 (5) -> regreso por Carmesí 29/30 (17) | jefe final: Lord Malakor
```
