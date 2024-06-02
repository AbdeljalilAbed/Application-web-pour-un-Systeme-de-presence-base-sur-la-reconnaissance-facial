function getJourEtHoraire(idCreneau) {
  // Dictionnaire des noms des jours pour les jours de semaine
  const jours = {
    1: "Lundi",
    2: "Mardi",
    3: "Mercredi",
    4: "Jeudi",
    5: "Vendredi",
    6: "Samedi",
  };

  // Liste des créneaux horaires
  const slots = [
    [480, 570], // Créneau 1 (08:00 - 09:30)
    [570, 670], // Créneau 2 (09:40 - 11:10)
    [670, 770], // Créneau 3 (11:20 - 12:50)
    [770, 870], // Créneau 4 (13:00 - 14:30)
    [870, 970], // Créneau 5 (14:40 - 16:10)
    [970, 1070], // Créneau 6 (16:20 - 17:50)
  ];

  // Extraire le jour et l'ID du créneau de l'IdCreneau
  const jourId = parseInt(idCreneau[0], 10);
  const slotId = parseInt(idCreneau[1], 10) - 1;

  // Obtenir le nom du jour
  const jour = jours[jourId];

  // Obtenir les heures de début et de fin du créneau
  const [start, end] = slots[slotId];
  const startHour = Math.floor(start / 60);
  const startMinute = start % 60;
  const endHour = Math.floor(end / 60);
  const endMinute = end % 60;

  // Formater l'horaire en chaîne de caractères
  const formatTime = (hour, minute) =>
    `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  const horaire = `${formatTime(startHour, startMinute)} - ${formatTime(
    endHour,
    endMinute
  )}`;

  return { jour, horaire };
}

module.exports = getJourEtHoraire;
