import semver from "semver";

export function checkVersions(dependencies) {
  return dependencies.map((dep) => {
    const ok = semver.satisfies(dep.installed, dep.wanted);
    const floor = semver.minVersion(dep.wanted);
    return {
      name: dep.name,
      installed: dep.installed,
      wanted: dep.wanted,
      ok,
      need: floor ? floor.version : dep.wanted,
    };
  });
}
