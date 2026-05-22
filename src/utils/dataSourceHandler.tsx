type FilterDataSourceOptionsArgs = {
  dataSourceOptions: readonly string[];
  selectedSources: string[];
  sourceQuery: string;
};

export function getFilteredDataSourceOptions({
  dataSourceOptions,
  selectedSources,
  sourceQuery,
}: FilterDataSourceOptionsArgs) {
  const normalizedQuery = sourceQuery.trim().toLowerCase();

  return dataSourceOptions.filter((option) => {
    const isAlreadySelected = selectedSources.includes(option);
    const matchesQuery =
      !normalizedQuery || option.toLowerCase().includes(normalizedQuery);

    return !isAlreadySelected && matchesQuery;
  });
}

export function addSelectedSource(
  currentSources: string[],
  sourceOption: string,
) {
  if (currentSources.includes(sourceOption)) {
    return currentSources;
  }

  return [...currentSources, sourceOption];
}

export function removeSelectedSource(
  currentSources: string[],
  sourceOption: string,
) {
  return currentSources.filter(
    (currentSource) => currentSource !== sourceOption,
  );
}
