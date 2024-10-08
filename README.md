# Patrimoine
## voici l'url de mon site deployé sur render:
_ pour le front: https://patrimoine-economique-ui-flui.onrender.com
_ pour le backend: https://patrimoine-economique-backend-0yha.onrender.com/possession (pour acceder au json contenant la liste des possessions)

## TODO:

- Backend (NodeJS/Express)

  Create folder `backend` in the root

  Endpoints:

  - /possession: Get Possession list
  - /possession: Create Possession: [libelle, valeur, dateDebut, taux]
  - /possession/:libelle: Update Possession by libelle: [libelle, dateFin]
  - /possession/:libelle/close: Close Possession => set dateFin to current Date
  - /patrimoine/:date: Get Valeur Patrimoine: [Date] => Valeur
  - /patrimoine/range:
    {
    type: 'month',
    dateDebut: xxx,
    dateFin: xxx,
    jour: xx
    }
    Get Valeur Patrimoine Range: [DateDebut, DateFin, Jour, type] => Valeur Patrimoine between dateDebut - dateFin by type=month

- UI (React JS):
  - Header:
    - Menu Patrimoine => Page patrimoine
    - Menu Possessions => Page List Possession
  - Page Patrimoine (/patrimoine)
    - Chart:
      - DatePicker dateDebut, DatePicker dateFin, Select Jour
      - Button: Validate => onClick -> Get Valeur Patrimoine by Range with Jour
      - Line Chart (Chart.js)
    - Get valeur patrimoine:
      - DatePicker Date
      - Button: Validâtes => onClick -> Get Valeur Patrimoine on the selected date
  - Page List Possession: (/possession)
    - Button Create Possession: Redirect to Create Possession page
    - Tableau: List possession
      - Column: Libelle, Valeur, Date Début, Date Fin, Taux, Valeur actuelle + [Action]
      - Action:
        - Edit: Redirect to Edition Possession page
        - Close/Clôture -> API: Close Possession
  - Create Possession: (/possession/create)
    - Inputs: Libelle, Valeur, date début, taux
  - Update Possession: (/possession/:libelle/update)
    - Inputs: Libelle, date fin
