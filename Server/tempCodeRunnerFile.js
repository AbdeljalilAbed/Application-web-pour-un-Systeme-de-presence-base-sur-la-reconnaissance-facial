result = EModel.aggregate([
  {
    $match: {
      MatriculeProf: "1",
      IdCreneau: "34",
    },
  },
  {
    $project: { _id: 0, section: 1, groupe: 1 },
  },
]);
result.map((result) => result.MatriculeEtd, console.log(result));