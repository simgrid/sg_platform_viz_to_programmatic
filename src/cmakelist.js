// content for cmakelist.txt file in c++ download zip package
export const cmakelist =
    "\n" +
    "cmake_minimum_required(VERSION 3.2)\n" +
    "message(STATUS \"Cmake version ${CMAKE_MAJOR_VERSION}.${CMAKE_MINOR_VERSION}.${CMAKE_PATCH_VERSION}\")\n" +
    "\n" +
    "project(simgrid-platform-explorer)\n" +
    "\n" +
    "# Disable annoying warnings\n" +
    "add_definitions(\"-DBOOST_ALLOW_DEPRECATED_HEADERS\")\n" +
    "\n" +
    "add_definitions(\"-Wall -Wno-unused-variable -Wno-unused-private-field\")\n" +
    "\n" +
    "set(CMAKE_CXX_STANDARD 17)\n" +
    "\n" +
    "set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} \"${CMAKE_SOURCE_DIR}/CMakeModules/\")\n" +
    "\n" +
    "# Find SimGrid, and Boost\n" +
    "find_package(SimGrid REQUIRED)\n" +
    "find_package(Boost REQUIRED)\n" +
    "find_package(Boost COMPONENTS program_options REQUIRED)\n" +
    "\n" +
    "# include directories\n" +
    "include_directories(/usr/local/include/ /opt/local/include/ ${SimGrid_INCLUDE_DIR} ${Boost_INCLUDE_DIR})\n" +
    "\n" +
    "# Executable\n" +
    "add_executable(simgrid_platform_explorer main.cpp)\n" +
    "target_link_libraries(simgrid_platform_explorer\n" +
    "        ${SimGrid_LIBRARY}\n" +
    "        ${Boost_LIBRARIES}\n" +
    "        )\n" +
    "\n" +
    "# Custom target for the .so file\n" +
    "add_custom_target(shared_object_file ALL\n" +
    "        DEPENDS\n" +
    "        ${CMAKE_CURRENT_BINARY_DIR}/platform_creator.so)\n" +
    "\n" +
    "# Custom command for the .so file\n" +
    "add_custom_command(\n" +
    "        OUTPUT platform_creator.so\n" +
    "        COMMAND g++ -fPIC --std=c++17 -Wno-deprecated-builtins -I${SimGrid_INCLUDE_DIR} -I${Boost_INCLUDE_DIR} ${CMAKE_SOURCE_DIR}/platform_creator.cpp -c -o ${CMAKE_CURRENT_BINARY_DIR}/platform_creator.o\n" +
    "        COMMAND g++ -fPIC -shared ${CMAKE_CURRENT_BINARY_DIR}/platform_creator.o -o platform_creator.so ${SimGrid_LIBRARY}\n" +
    "        DEPENDS ${CMAKE_SOURCE_DIR}/platform_creator.cpp\n" +
    "        )\n" +
    "\n" +
    "install(TARGETS simgrid_platform_explorer DESTINATION bin)"
