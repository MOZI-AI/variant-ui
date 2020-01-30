const a = {
  chrom: "1",
  pos: 949392,
  id: "rs184768190",
  ref: "C",
  alt: "T",
  hgvs: "1:g.949392C>T",
  clinvar: {
    annotation: {
      alleleMapping: 0,
      hgvsVariant: "NC_000001.10:g.984820C>G",
      sourceInfos: null,
      origin: ["GERMLINE"],
      diseaseInfos: [
        {
          significance: ["Uncertain_significance"],
          diseaseDBID: "MedGen:C3808739",
          diseaseDBName: "Myasthenic_syndrome",
          revisionStatus: ["criteria_provided"]
        }
      ]
    },
    pumeds: ["28492532"]
  },
  population: {
    all: {
      thousandGenome: null,
      exac: null,
      gnomadExome: {
        homAlt: 0,
        ac: 8,
        an: 2908,
        af: 0.0257898
      }
    },
    oth: {
      thousandGenome: null,
      exac: null,
      gnomadExome: {
        homAlt: 0,
        ac: 1,
        an: 94,
        af: 0.0106383
      }
    },
    sas: {
      thousandGenome: null,
      exac: null,
      gnomadExome: {
        homAlt: 0,
        ac: 0,
        an: 914,
        af: 0.0
      }
    },
    eas: {
      thousandGenome: null,
      exac: null,
      gnomadExome: {
        homAlt: 0,
        ac: 0,
        an: 374,
        af: 0.0
      }
    },
    amr: {
      thousandGenome: null,
      exac: null,
      gnomadExome: {
        homAlt: 0,
        ac: 0,
        an: 430,
        af: 0.0
      }
    },
    asj: {
      thousandGenome: null,
      exac: null,
      gnomadExome: {
        homAlt: 0,
        ac: 0,
        an: 20,
        af: 0.0
      }
    },
    fin: {
      thousandGenome: null,
      exac: null,
      gnomadExome: {
        homAlt: 0,
        ac: 0,
        an: 22,
        af: 0.0
      }
    },
    afr: {
      thousandGenome: null,
      exac: null,
      gnomadExome: {
        homAlt: 0,
        ac: 7,
        an: 462,
        af: 0.0151515
      }
    },
    nfe: {
      thousandGenome: null,
      exac: null,
      gnomadExome: {
        homAlt: 0,
        ac: 0,
        an: 592,
        af: 0.0
      }
    },
    eas_jpn: {
      thousandGenome: null,
      exac: null,
      gnomadExome: {
        homAlt: 0,
        ac: 0,
        an: 0,
        af: -1.0
      }
    }
  },
  effect: {
    annotation: [
      {
        consequence: "upstream_gene_variant",
        impact: "MODIFIER",
        featureType: "transcript",
        featureId: "ENST00000606857.1",
        bioType: "Noncoding",
        cdsChange: "",
        proteinChange: ""
      }
    ],
    hgvsNomination: ["ENST00000606857.1(OR4G4P):n.51047A>T"]
  },
  scores: {
    sift: {
      score: 0.001,
      prediction: "DELETERIOUS"
    },
    polyphen2: {
      score: 0.995,
      prediction: "DELETERIOUS"
    },
    lrt: {
      score: 0.010181,
      prediction: "NEUTRAL"
    },
    cadd: 3.699654,
    mutationTaster: 0.789588,
    dann: 0.9975511911210873,
    vest4: 0.49
  },
  gene: "OR4F5",
  acmg: {
    verdict: "Pathogenic",
    pvs1: 1,
    ps: [0, 0, 0, 0, 0],
    pm: [0, 1, 0, 0, 0, 0, 0],
    pp: [0, 0, 1, 0, 1, 0],
    ba1: 0,
    bs: [0, 0, 0, 0, 0],
    bp: [0, 0, 0, 0, 0, 0, 0, 0],
    exonicFunction: "stopgain",
    diseaseInfos: [
      {
        diseaseId: "144",
        diseaseName: "Lynch syndrome",
        prevalence: "Unknown",
        inheritance: "Autosomal dominant",
        ageOnset: "Adult",
        omimIds: [
          "120435",
          "609310",
          "613244",
          "614331",
          "614337",
          "614350",
          "614385"
        ]
      },
      {
        diseaseId: "252202",
        diseaseName: "Constitutional mismatch repair deficiency syndrome",
        prevalence: "-",
        inheritance: "Autosomal recessive",
        ageOnset: "Childhood",
        omimIds: ["276300"]
      }
    ]
  }
};

export default a;
