export const mongodbFacetDataAndTotal = (pipline) => {
  return [
    {
      $facet: {
        data: [...pipline],
        total: [
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
    {
      $project: {
        data: 1,
        total: { $arrayElemAt: ['$total', 0] },
      },
    },
    {
      $project: {
        data: 1,
        total: '$total.count',
      },
    }];
};
