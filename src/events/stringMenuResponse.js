const {
    Events,
    TextDisplayBuilder,
    ContainerBuilder,
    MessageFlags,
} = require("discord.js");
const { preservedRoles, departments } = require("../utils/config.json");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isStringSelectMenu()) return;

        if (interaction.customId.startsWith("voiceRoomSettings-")) {
            const [action, channelId, userId] = interaction.customId.split("-");
            const voiceChannel =
                interaction.guild.channels.cache.get(channelId);

            if (interaction.user.id !== userId) {
                const notOwnerComponent = [
                    new ContainerBuilder().addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            "🚫 คุณไม่มีสิทธิ์ เนื่องจากไม่ใช่เจ้าของห้อง"
                        )
                    ),
                ];

                return interaction.reply({
                    components: notOwnerComponent,
                    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
                });
            }

            switch (interaction.values[0]) {
                case "vcLock": {
                    const modChannel = await voiceChannel.fetch(channelId);

                    if (!modChannel) {
                        const notFoundComponent = [
                            new ContainerBuilder().addTextDisplayComponents(
                                new TextDisplayBuilder().setContent(
                                    "🚫 ไม่พบห้องเสียงที่ระบุ"
                                )
                            ),
                        ];

                        return interaction.reply({
                            components: notFoundComponent,
                            flags:
                                MessageFlags.Ephemeral |
                                MessageFlags.IsComponentsV2,
                        });
                    }

                    await modChannel.permissionOverwrites.edit(
                        modChannel.guild.roles.everyone,
                        { Connect: false }
                    );

                    const components = [
                        new ContainerBuilder().addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(
                                "✅ ห้องเสียงถูกล็อคแล้ว"
                            )
                        ),
                    ];

                    await interaction.reply({
                        components: components,
                        flags:
                            MessageFlags.Ephemeral |
                            MessageFlags.IsComponentsV2,
                    });

                    break;
                }
                case "vcUnlock": {
                    const modChannel = await voiceChannel.fetch(channelId);

                    if (!modChannel) {
                        const notFoundComponent = [
                            new ContainerBuilder().addTextDisplayComponents(
                                new TextDisplayBuilder().setContent(
                                    "🚫 ไม่พบห้องเสียงที่ระบุ"
                                )
                            ),
                        ];

                        return interaction.reply({
                            components: notFoundComponent,
                            flags:
                                MessageFlags.Ephemeral |
                                MessageFlags.IsComponentsV2,
                        });
                    }

                    await modChannel.permissionOverwrites.edit(
                        modChannel.guild.roles.everyone,
                        { Connect: true }
                    );

                    const components = [
                        new ContainerBuilder().addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(
                                "✅ ห้องเสียงถูกปลดล็อคแล้ว"
                            )
                        ),
                    ];

                    await interaction.reply({
                        components: components,
                        flags:
                            MessageFlags.Ephemeral |
                            MessageFlags.IsComponentsV2,
                    });

                    break;
                }
                default: {
                    const components = [
                        new ContainerBuilder().addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(
                                "🕐 ฟีเจอร์นี้ยังไม่พร้อมใช้งานในขณะนี้"
                            )
                        ),
                    ];

                    await interaction.reply({
                        components: components,
                        flags:
                            MessageFlags.Ephemeral |
                            MessageFlags.IsComponentsV2,
                    });
                }
            }
        }

        switch (interaction.customId) {
            // select menu for department roles
            case "department_roles_selection": {
                async function handleDepartmentSelection(
                    interaction,
                    selectedKey
                ) {
                    const allDeptIds = Object.values(departments);

                    const rolesToRemove = allDeptIds.filter(
                        (id) => !preservedRoles.includes(id)
                    );

                    if (rolesToRemove.length) {
                        await interaction.member.roles.remove(rolesToRemove);
                    }

                    const newDeptId = departments[selectedKey];

                    if (newDeptId) {
                        await interaction.member.roles.add(newDeptId);
                    }

                    try {
                        await interaction.member.setNickname(null);

                        await interaction.member.setNickname(
                            `[${selectedKey.toUpperCase()}] ${
                                interaction.member.user.username
                            }`
                        );
                    } catch (error) {
                        console.error(
                            "[department_roles_selection] error :",
                            error
                        );
                    }

                    const addComponent = [
                        new ContainerBuilder().addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(
                                `✅ เพิ่มตำแหน่งภาควิชา ${selectedKey.toUpperCase()} แล้ว`
                            )
                        ),
                    ];

                    await interaction.reply({
                        components: addComponent,
                        flags:
                            MessageFlags.Ephemeral |
                            MessageFlags.IsComponentsV2,
                    });
                }

                switch (interaction.values[0]) {
                    case "department_roles_remove": {
                        try {
                            const allDeptIds = Object.values(departments);

                            const rolesToRemove = allDeptIds.filter(
                                (id) => !preservedRoles.includes(id)
                            );

                            if (rolesToRemove.length) {
                                await interaction.member.roles.remove(
                                    rolesToRemove
                                );
                            }

                            await interaction.member.setNickname(null);
                        } catch (error) {
                            console.error(
                                "[department_roles_remove] error :",
                                error
                            );
                        }

                        const removeComponent = [
                            new ContainerBuilder().addTextDisplayComponents(
                                new TextDisplayBuilder().setContent(
                                    "✅ ลบตำแหน่งภาควิชาออกแล้ว"
                                )
                            ),
                        ];

                        await interaction.reply({
                            components: removeComponent,
                            flags:
                                MessageFlags.Ephemeral |
                                MessageFlags.IsComponentsV2,
                        });

                        break;
                    }

                    case "department_mae": {
                        await handleDepartmentSelection(interaction, "mae");
                        break;
                    }

                    case "department_ece": {
                        await handleDepartmentSelection(interaction, "ece");
                        break;
                    }

                    case "department_pe": {
                        await handleDepartmentSelection(interaction, "pe");
                        break;
                    }

                    case "department_che": {
                        await handleDepartmentSelection(interaction, "che");
                        break;
                    }

                    case "department_mhle": {
                        await handleDepartmentSelection(interaction, "mhle");
                        break;
                    }

                    case "department_mpte": {
                        await handleDepartmentSelection(interaction, "mpte");
                        break;
                    }

                    case "department_iee": {
                        await handleDepartmentSelection(interaction, "iee");
                        break;
                    }

                    case "department_ce": {
                        await handleDepartmentSelection(interaction, "ce");
                        break;
                    }

                    case "department_ie": {
                        await handleDepartmentSelection(interaction, "ie");
                        break;
                    }
                }
            }
        }
    },
};
