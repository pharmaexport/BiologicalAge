# Méthodologie et traçabilité — BiologicalAge

## Statut de l’outil

BiologicalAge est un outil éducatif d’orientation fondé sur un questionnaire de mode de vie. Il ne mesure aucun biomarqueur, ne pose aucun diagnostic et ne remplace ni l’évaluation clinique, ni les examens biologiques, ni les conseils personnalisés d’un professionnel de santé.

Les sources institutionnelles ci-dessous justifient les **domaines évalués** et certains **repères de santé publique**. Elles ne valident pas la formule de pondération ni la conversion finale du score en « âge biologique ».

## Correspondance entre les blocs et les sources

| Bloc | Repères retenus | Sources institutionnelles | Utilisation dans l’application |
|---|---|---|---|
| Profil et morphologie | L’IMC est un indicateur de dépistage ; chez l’adulte, IMC ≥ 25 correspond au surpoids et IMC ≥ 30 à l’obésité. Le tour de taille peut compléter l’IMC. | [OMS — Obesity and overweight](https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight) | L’IMC et le rapport tour de taille/taille contribuent au sous-score morphologique. Ils ne sont pas interprétés comme un diagnostic individuel. |
| Activité et sédentarité | Toute activité compte ; au moins 150 minutes d’activité modérée par semaine constituent le repère minimal adulte. Le temps sédentaire doit être limité et le renforcement musculaire est bénéfique. | [OMS — Physical activity](https://www.who.int/news-room/fact-sheets/detail/physical-activity) ; [OMS — Guidelines on physical activity and sedentary behaviour](https://www.who.int/publications/i/item/9789240015128) | Les minutes modérées et intenses, le renforcement, la mobilité et le temps assis alimentent les sous-scores activité et sédentarité. Un second sport peut être déclaré pour mieux décrire la pratique, mais il n’ajoute pas automatiquement de points : les minutes saisies doivent cumuler l’ensemble des activités. |
| Sommeil et récupération | Pour la plupart des adultes de 18 à 60 ans, le CDC indique au moins 7 heures de sommeil ; la qualité compte autant que la durée. Le stress chronique peut affecter la santé, mais une auto-évaluation ne constitue pas un diagnostic. | [CDC — About Sleep](https://www.cdc.gov/sleep/about/index.html) ; [OMS — Stress](https://www.who.int/news-room/questions-and-answers/item/stress) | La durée et la qualité du sommeil, le stress, la fatigue et la stabilité de l’énergie contribuent aux sous-scores sommeil et récupération. |
| Nutrition | Une alimentation saine privilégie des aliments peu transformés et variés, notamment fruits et légumes, légumineuses, céréales complètes et noix. L’OMS recommande au moins 400 g de fruits et légumes par jour, moins de 10 % de l’énergie sous forme de sucres libres et moins de 5 g de sel par jour. | [OMS — Healthy diet](https://www.who.int/news-room/fact-sheets/detail/healthy-diet) | Les fréquences déclarées sont transformées en points. Le questionnaire n’évalue ni les portions exactes, ni l’apport énergétique, ni les carences biologiques. |
| Tabac et nicotine | Toutes les formes de tabac sont nocives ; la nicotine est fortement addictive et les cigarettes électroniques ne sont pas considérées comme sans danger. | [OMS — Tobacco and nicotine](https://www.who.int/news-room/fact-sheets/detail/tobacco) | Le statut tabagique ou nicotinique influence le sous-score dédié. Ce sous-score ne quantifie pas les paquets-années ni l’exposition passive. |
| Alcool | En France, le repère de consommation à moindre risque est au maximum 10 verres standard par semaine, au maximum 2 par jour, avec des jours sans alcool. « À moindre risque » ne signifie pas « sans risque ». | [Santé publique France — Alcool Info Service](https://www.alcool-info-service.fr/) | Le nombre de verres hebdomadaires influence le sous-score alcool. La répartition des consommations et les situations particulières ne sont pas modélisées. |
| Tension et fréquence cardiaque | L’Assurance Maladie définit l’HTA au cabinet par une pression systolique ≥ 140 mmHg ou diastolique ≥ 90 mmHg, constatée à plusieurs reprises. Un pouls adulte au repos est généralement situé entre 60 et 100/min, avec des valeurs plus basses possibles chez les personnes entraînées. | [Assurance Maladie — Hypertension artérielle](https://www.ameli.fr/assure/sante/themes/hypertension-arterielle-hta/definition-facteurs-favorisants) ; [NIH/NLM MedlinePlus — Pulse](https://medlineplus.gov/ency/article/003399.htm) | Ces mesures sont optionnelles et ne déclenchent jamais de diagnostic. Une mesure isolée doit être confirmée et interprétée cliniquement. |

## Construction interne du score

Le score total est normalisé sur 100 à partir de neuf composantes :

- nutrition : 35 points ;
- activité physique : 20 points ;
- sédentarité : 10 points ;
- sommeil : 10 points ;
- stress et fatigue : 10 points ;
- tabac et nicotine : 12 points ;
- alcool : 6 points ;
- morphologie : 10 points ;
- mesures de santé : 7 points.

Le total brut maximal est de 120 points, ensuite converti sur une échelle de 0 à 100.

Ces pondérations sont des **choix de conception internes**. Elles ne correspondent pas à une échelle clinique publiée et n’ont pas fait l’objet d’une validation prospective.

## Conversion du score en âge estimé

L’application applique une interpolation interne entre plusieurs points d’ancrage :

| Score | Décalage appliqué à l’âge chronologique |
|---:|---:|
| 90 à 100 | jusqu’à −72 mois |
| 80 | −48 mois |
| 70 | −24 mois |
| 60 | 0 mois |
| 50 | +24 mois |
| 40 | +48 mois |
| 0 | +84 mois |

Cette conversion est une représentation pédagogique destinée à rendre le résultat compréhensible. Elle **ne doit pas être présentée comme une mesure d’âge biologique validée**, contrairement à certaines méthodes fondées sur des biomarqueurs cliniques, épigénétiques ou physiologiques.

## Limites principales

- Questionnaire déclaratif exposé aux biais de mémoire et de désirabilité sociale.
- Absence de données biologiques, traitements, antécédents, sexe, grossesse, pathologies et contexte socio-économique.
- Fréquences alimentaires simplifiées, sans quantification complète des apports.
- Mesures de tension et de pouls non standardisées par l’application.
- Non destiné aux mineurs, à l’urgence médicale ni à l’aide à la prescription.
- Toute perte de poids involontaire, fatigue inhabituelle, douleur, dyspnée, malaise ou mesure anormale nécessite une évaluation professionnelle.

## Révision documentaire

Dernière reconstruction documentaire : **16 juillet 2026**. Les liens doivent être vérifiés périodiquement et les seuils réévalués lors de toute mise à jour majeure des recommandations institutionnelles.
