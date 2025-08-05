const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    InteractionContextType,
    MessageFlags,
    ThumbnailBuilder,
    SectionBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ContainerBuilder,
} = require("discord.js");
const memberInfo = require("../../models/users.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("ดูข้อมูลส่วนตัวของคุณ")
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            const userInfo = await memberInfo.findOne({
                userID: interaction.user.id,
            });

            if (!userInfo) {
                const profileErrorComponents = [
                    new ContainerBuilder().addSectionComponents(
                        new SectionBuilder()
                            .setButtonAccessory(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Primary)
                                    .setLabel("ตั้งค่าโปรไฟล์")
                                    .setCustomId("setup_profile")
                            )
                            .addTextDisplayComponents(
                                new TextDisplayBuilder().setContent(
                                    "❌ กรุณาตั้งค่าโปรไฟล์ก่อนดำเนินการ"
                                )
                            )
                    ),
                ];

                return interaction.editReply({
                    components: profileErrorComponents,
                    flags: MessageFlags.IsComponentsV2,
                });
            }

            const profileComponent = [
                new ContainerBuilder()
                    .addSectionComponents(
                        new SectionBuilder()
                            .setThumbnailAccessory(
                                new ThumbnailBuilder().setURL(
                                    interaction.user.displayAvatarURL({
                                        extension: "png",
                                    })
                                )
                            )
                            .addTextDisplayComponents(
                                new TextDisplayBuilder().setContent(
                                    [
                                        `# <@${interaction.user.id}>`,
                                        `ᅠ`,
                                        `👤 ชื่อเล่น : \`\`${
                                            userInfo.nickname || "-"
                                        }\`\``,
                                        `🌿 สาขาวิชา : \`\`${
                                            userInfo.department || "-"
                                        }\`\``,
                                        `📱 ไอจี : \`\`${
                                            userInfo.instagram || "-"
                                        }\`\``,
                                    ].join("\n")
                                )
                            )
                    )
                    .addSeparatorComponents(
                        new SeparatorBuilder()
                            .setSpacing(SeparatorSpacingSize.Large)
                            .setDivider(true)
                    )
                    .addActionRowComponents(
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Primary)
                                .setLabel("แก้ไขโปรไฟล์")
                                .setCustomId("edit_profile"),
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setLabel("Instagram")
                                .setURL(
                                    userInfo.instagram
                                        ? `https://www.instagram.com/${userInfo.instagram}`
                                        : "https://www.instagram.com/"
                                )
                                .setDisabled(!userInfo.instagram)
                        )
                    ),
            ];

            await interaction.editReply({
                components: profileComponent,
                flags: MessageFlags.IsComponentsV2,
            });
        } catch (error) {
            console.error("[profile] error:", error);
        }
    },
};
