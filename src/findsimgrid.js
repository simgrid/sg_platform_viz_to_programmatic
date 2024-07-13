// content for findsimgrid file in c++ download zip package
export const findsimgrid =
    ' \n' +
    '# CMake find module to search for the SimGrid library. \n' +
    ' \n' +
    '# Copyright (c) 2016-2023. The SimGrid Team. \n' +
    '# \n' +
    '# This file is free software; you can redistribute it and/or modify it \n' +
    '# under the terms of the license (GNU LGPL) which comes with this package. \n' +
    ' \n' +
    '# \n' +
    '# USERS OF PROGRAMS USING SIMGRID \n' +
    '# ------------------------------- \n' +
    '# \n' +
    '# If cmake does not find this file, add its path to CMAKE_PREFIX_PATH: \n' +
    '#    CMAKE_PREFIX_PATH="/path/to/FindSimGrid.cmake:$CMAKE_PREFIX_PATH"  cmake . \n' +
    '# \n' +
    '# If this file does not find SimGrid, define SimGrid_PATH: \n' +
    '#    cmake -DSimGrid_PATH=/path/to/simgrid . \n' +
    ' \n' +
    '# \n' +
    '# DEVELOPERS OF PROGRAMS USING SIMGRID \n' +
    '# ------------------------------------ \n' +
    '# \n' +
    '#  1. Include this file in your own CMakeLists.txt (before defining any target) \n' +
    '#     Either by copying it in your tree, or (recommended) by using the \n' +
    '#     version automatically installed by SimGrid. \n' +
    '# \n' +
    "#  2. This will define a target called 'SimGrid::Simgrid'. Use it as: \n" +
    '# target_link_libraries(your-simulator SimGrid::SimGrid) \n' +
    '# \n' +
    '#  It also defines a SimGrid_VERSION macro, that you can use to deal with API \n' +
    '#    evolutions as follows: \n' +
    '# \n' +
    '#    #if SimGrid_VERSION < 31800 \n' +
    '#      (code to use if the installed version is lower than v3.18) \n' +
    '#    #elif SimGrid_VERSION < 31900 \n' +
    '#      (code to use if we are using SimGrid v3.18.x) \n' +
    '#    #else \n' +
    '#      (code to use with SimGrid v3.19+) \n' +
    '#    #endif \n' +
    '# \n' +
    '#  Since SimGrid header files require C++17, so we set CMAKE_CXX_STANDARD to 17. \n' +
    '#    Change this variable in your own file if you need a later standard. \n' +
    ' \n' +
    '# \n' +
    '# IMPROVING THIS FILE \n' +
    '# ------------------- \n' +
    '#  - Use automatic SimGridConfig.cmake creation via export/install(EXPORT in main CMakeLists.txt: \n' +
    '#    https://cliutils.gitlab.io/modern-cmake/chapters/exporting.html \n' +
    '#    https://cmake.org/Wiki/CMake/Tutorials/How_to_create_a_ProjectConfig.cmake_file \n' +
    '#    https://github.com/boostcon/cppnow_presentations_2017/blob/master/05-19-2017_friday/effective_cmake__daniel_pfeifer__cppnow_05-19-2017.pdf \n' +
' \n' +
'cmake_minimum_required(VERSION 2.8.12) \n' +
' \n' +
'set(CMAKE_CXX_STANDARD 17) \n' +
'set(CMAKE_CXX_STANDARD_REQUIRED ON) \n' +
' \n' +
'find_path(SimGrid_INCLUDE_DIR \n' +
'  NAMES simgrid/config.h \n' +
'  NAMES simgrid/version.h \n' +
'  PATHS ${SimGrid_PATH}/include /opt/simgrid/include \n' +
') \n' +
'if (NOT SimGrid_INCLUDE_DIR) \n' +
'  # search under the old name \n' +
'  find_path(SimGrid_INCLUDE_DIR \n' +
'    NAMES simgrid_config.h \n' +
'    PATHS ${SimGrid_PATH}/include /opt/simgrid/include \n' +
'  ) \n' +
'endif() \n' +
'find_library(SimGrid_LIBRARY \n' +
'  NAMES simgrid \n' +
'  PATHS ${SimGrid_PATH}/lib /opt/simgrid/lib \n' +
') \n' +
'mark_as_advanced(SimGrid_INCLUDE_DIR) \n' +
'mark_as_advanced(SimGrid_LIBRARY) \n' +
' \n' +
'if (SimGrid_INCLUDE_DIR) \n' +
'  set(SimGrid_VERSION_REGEX "^#define SIMGRID_VERSION_(MAJOR|MINOR|PATCH) ([0-9]+)$") \n' +
'  if (EXISTS "${SimGrid_INCLUDE_DIR}/simgrid/version.h") \n' +
'    file(STRINGS "${SimGrid_INCLUDE_DIR}/simgrid/version.h" SimGrid_VERSION_STRING REGEX ${SimGrid_VERSION_REGEX}) \n' +
'  elseif (EXISTS "${SimGrid_INCLUDE_DIR}/simgrid/config.h") \n' +
'    file(STRINGS "${SimGrid_INCLUDE_DIR}/simgrid/config.h" SimGrid_VERSION_STRING REGEX ${SimGrid_VERSION_REGEX}) \n' +
'  else() \n' +
'    file(STRINGS "${SimGrid_INCLUDE_DIR}/simgrid_config.h" SimGrid_VERSION_STRING REGEX ${SimGrid_VERSION_REGEX}) \n' +
'  endif() \n' +
'  set(SimGrid_VERSION "") \n' +
' \n' +
'  # Concat the matches to MAJOR.MINOR.PATCH assuming they appear in this order \n' +
'  foreach(match ${SimGrid_VERSION_STRING}) \n' +
'    if(SimGrid_VERSION) \n' +
'      set(SimGrid_VERSION "${SimGrid_VERSION}.") \n' +
'    endif() \n' +
'    string(REGEX REPLACE ${SimGrid_VERSION_REGEX} "${SimGrid_VERSION}//2" SimGrid_VERSION ${match}) \n' +
'    set(SimGrid_VERSION_${CMAKE_MATCH_1} ${CMAKE_MATCH_2}) \n' +
'  endforeach() \n' +
'  unset(SimGrid_VERSION_STRING) \n' +
'  unset(SimGrid_VERSION_REGEX) \n' +
'endif () \n' +
' \n' +
'include(FindPackageHandleStandardArgs) \n' +
'find_package_handle_standard_args(SimGrid \n' +
'  FOUND_VAR SimGrid_FOUND \n' +
'  REQUIRED_VARS SimGrid_INCLUDE_DIR SimGrid_LIBRARY \n' +
'  VERSION_VAR SimGrid_VERSION \n' +
') \n' +
' \n' +
'if (SimGrid_FOUND) \n' +
'  add_library(SimGrid::SimGrid SHARED IMPORTED) \n' +
'  set_target_properties(SimGrid::SimGrid PROPERTIES \n' +
'    INTERFACE_SYSTEM_INCLUDE_DIRECTORIES ${SimGrid_INCLUDE_DIR} \n' +
'    INTERFACE_COMPILE_FEATURES cxx_alias_templates \n' +
'    IMPORTED_LOCATION ${SimGrid_LIBRARY} \n' +
'  ) \n' +
'  # We need C++17, so check for it just in case the user removed it since compiling SimGrid \n' +
'  if (NOT CMAKE_VERSION VERSION_LESS 3.8) \n' +
'    # 3.8+ allows us to simply require C++17 (or higher) \n' +
'    set_property(TARGET SimGrid::SimGrid PROPERTY INTERFACE_COMPILE_FEATURES cxx_std_17) \n' +
'  else () \n' +
'    # Old CMake cant do much.Just check the CXX_FLAGS and inform the user when C++ 17 feature does not work \n' +
'    include(CheckCXXSourceCompiles) \n' +
'    set(CMAKE_REQUIRED_FLAGS "${CMAKE_CXX_FLAGS}") \n' +
'    check_cxx_source_compiles(" \n' +
'#if __cplusplus < 201703L \n' +
'#error \n' +
'#else \n' +
'int main(){} \n' +
'#endif \n' +
'" _SIMGRID_CXX17_ENABLED) \n' +
'    if (NOT _SIMGRID_CXX17_ENABLED) \n' +
'        message(WARNING "C++17 is required to use SimGrid. Enable it with e.g. -std=c++17") \n' +
'    endif () \n' +
'    unset(_SIMGRID_CXX14_ENABLED CACHE) \n' +
'  endif () \n' +
'endif () \n'