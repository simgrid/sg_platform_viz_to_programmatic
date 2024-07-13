// content for main.cpp file in c++ download zip package
export const maincpp =
    "#include <iostream>\n" +
    "#include <simgrid/s4u.hpp>\n" +
    "#include <boost/program_options.hpp>\n" +
    "\n" +
    "namespace po = boost::program_options;\n" +
    "namespace sg4 = simgrid::s4u;\n" +
    "\n" +
    "int main(int argc, char **argv) {\n" +
    "\n" +
    "    std::string hostnames;\n" +
    "    std::string path_to_so_file;\n" +
    "    po::options_description desc(\"Usage\");\n" +
    "    desc.add_options()\n" +
    "            (\"help\",\n" +
    "             \"Show this help message\\n\")\n" +
    "            (\"so\", po::value<std::string>(&path_to_so_file)->required()->value_name(\"<path to a .so file>\"),\n" +
    "             \"path to a .so file that implements the load_platform() function\\n\")\n" +
    "            (\"show_hosts\",\n" +
    "             \"Show name and information for all the hosts in the platform\\n\")\n" +
    "            (\"show_links\",\n" +
    "             \"Show name and information for all the links platform\\n\")\n" +
    "            (\"show_links\",\n" +
    "             \"Show name and information for all the links platform\\n\")\n" +
    "            (\"show_routes\", po::value<std::string>(&hostnames)->value_name(\"<comma-separated list of host names>\"),\n" +
    "             \"Show routes between all specified hosts\\n\")\n" +
    "            ;\n" +
    "\n" +
    "    // Parse command-line arguments\n" +
    "    po::variables_map vm;\n" +
    "    try {\n" +
    "        po::store(po::parse_command_line(argc, argv, desc), vm);\n" +
    "        // Print help message and exit if needed\n" +
    "        if (vm.count(\"help\")) {\n" +
    "            std::cerr << desc;\n" +
    "            std::cerr << \"Example: \" << argv[0] << \" --so ./platform_creator.so --show_hosts\\n\\n\";\n" +
    "            exit(0);\n" +
    "        }\n" +
    "        // Throw whatever exception in case argument values are erroneous\n" +
    "        po::notify(vm);\n" +
    "    } catch (std::exception &e) {\n" +
    "        std::cerr << \"Invalid arguments!\" << \"\\n\\n\";\n" +
    "        std::cerr << desc;\n" +
    "        std::cerr << \"Example: \" << argv[0] << \" --so ./platform_creator.so --show_hosts\\n\\n\";\n" +
    "        exit(1);\n" +
    "    }\n" +
    "\n" +
    "    sg4::Engine::get_instance()->load_platform(path_to_so_file);\n" +
    "    auto num_hosts = sg4::Engine::get_instance()->get_all_hosts().size();\n" +
    "    std::cerr << \"Platform successfully created\\n\";\n" +
    "\n" +
    "    if (vm.count(\"show_hosts\")) {\n" +
    "       std::cout << \"Hosts:\\n\";\n" +
    "       std::vector<simgrid::s4u::Host *> host_list = simgrid::s4u::Engine::get_instance()->get_all_hosts();\n" +
    "       for (auto const &h: host_list) {\n" +
    "           std::cout << \"  - Host: \" << h->get_name() << \"(#cores=\" << h->get_core_count() << \", speed=\" << h->get_speed() << \" fps)\\n\";\n" +
    "           if (not h->get_properties()->empty()) {\n" +
    "               std::cout << \"    - Properties:\\n\";\n" +
    "               for (auto const &p: *h->get_properties()) {\n" +
    "                   std::cout << \"       - \" << p.first << \": \" << p.second << \"\\n\";\n" +
    "               }\n" +
    "           }\n" +
    "       }\n" +
    "     }\n" +
    "\n" +
    "   if (vm.count(\"show_links\")) {\n" +
    "       std::cout << \"Links:\\n\";\n" +
    "       std::vector<simgrid::s4u::Link *> link_list = simgrid::s4u::Engine::get_instance()->get_all_links();\n" +
    "       for (auto const &l: link_list) {\n" +
    "           std::cout << \"  - Link: \" << l->get_name() << \"(bandwidth=\" << l->get_bandwidth() << \" bps, latency=\" << l->get_latency() << \" s)\\n\";\n" +
    "           if (not l->get_properties()->empty()) {\n" +
    "               std::cout << \"    - Properties:\\n\";\n" +
    "               for (auto const &p: *l->get_properties()) {\n" +
    "                   std::cout << \"       - \" << p.first << \": \" << p.second << \"\\n\";\n" +
    "               }\n" +
    "           }\n" +
    "       }\n" +
    "    }\n" +
    "\n" +
    "   if (vm.count(\"show_disks\")) {\n" +
    "       std::cout << \"Disks:\\n\";\n" +
    "       std::vector<std::string> tokens;\n" +
    "       std::vector<simgrid::s4u::Host *> host_list = simgrid::s4u::Engine::get_instance()->get_all_hosts();\n" +
    "       for (auto const &h: host_list) {\n" +
    "           std::vector<simgrid::s4u::Disk *> disk_list = h->get_disks();\n" +
    "           for (auto const &d: disk_list) {\n" +
    "               std::cout << \"  - Disk: \" << d->get_name() << \" (host: \" << h->get_name() << \", read bandwidth=\" << d->get_read_bandwidth() << \" bps, write bandwidth=\" << d->get_write_bandwidth() << \" bps)\\n\";\n" +
    "               if (not d->get_properties()->empty()) {\n" +
    "                   std::cout << \"    - Properties:\\n\";\n" +
    "                   for (auto const &p: *d->get_properties()) {\n" +
    "                       std::cout << \"       - \" << p.first << \": \" << p.second << \"\\n\";\n" +
    "                   }\n" +
    "                }\n" +
    "            }\n" +
    "       }\n" +
    "   }\n" +
    "\n" +
    "    if (vm.count(\"show_routes\")) {\n" +
    "        std::vector<std::string> tokens;\n" +
    "        if (hostnames == \"all\") {\n" +
    "            std::vector<simgrid::s4u::Host *> host_list = simgrid::s4u::Engine::get_instance()->get_all_hosts();\n" +
    "            std::vector<std::string> hostname_list;\n" +
    "            for (auto h: host_list) {\n" +
    "                tokens.push_back(h->get_name());\n" +
    "            }\n" +
    "        } else {\n" +
    "            std::stringstream ss(hostnames);\n" +
    "            std::string item;\n" +
    "            while (getline(ss, item, ',')) {\n" +
    "                tokens.push_back(item);\n" +
    "            }\n" +
    "        }\n" +
    "        for (int i=0; i < tokens.size(); i++) {\n" +
    "            for (int j=i+1; j < tokens.size(); j++) {\n" +
    "                auto h1 = tokens.at(i);\n" +
    "                auto h2 = tokens.at(j);\n" +
    "                if (h1 != h2) {\n" +
    "                    auto host1 = simgrid::s4u::Host::by_name_or_null(h1);\n" +
    "                    auto host2 = simgrid::s4u::Host::by_name_or_null(h2);\n" +
    "                    if (host1 == nullptr) {\n" +
    "                        std::cerr << \"Unknown host: \" << h1 << \"\\n\";\n" +
    "                        exit(1);\n" +
    "                    }\n" +
    "                    if (host2 == nullptr) {\n" +
    "                        std::cerr << \"Unknown host: \" << h2 << \"\\n\";\n" +
    "                        exit(1);\n" +
    "                    }\n" +
    "                    std::vector<simgrid::s4u::Link*> links;\n" +
    "                    double latency = 0.0;\n" +
    "                    host1->route_to(host2, links, &latency);\n" +
    "                    std::cout << \"Route from \" << h1 << \" to \" << h2 << \":\\n\";\n" +
    "                    for (const auto &link : links) {\n" +
    "                        std::cout << \"  Link: \" << link->get_name() << \"\\n\";\n" +
    "                    }\n" +
    "                    std::cout << \"  Total latency: \" << latency << \" (sec)\\n\";\n" +
    "                }\n" +
    "            }\n" +
    "        }\n" +
    "    }\n" +
    "\n" +
    "    return 0;\n" +
    "}\n"