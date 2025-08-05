const {
    Events,
    ContainerBuilder,
    TextDisplayBuilder,
    SectionBuilder,
    ThumbnailBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    MessageFlags,
} = require("discord.js");
const memberInfo = require("../models/users.js");

module.exports = {
    name: Events.InteractionCreate,
    once: false,

    async execute(interaction) {
        if (!interaction.isUserContextMenuCommand()) return;

        const target = interaction.targetUser;

        switch (interaction.commandName) {
            // check user info
            case "Info":
                try {
                    await interaction.deferReply({
                        flags: MessageFlags.Ephemeral,
                    });
                    const userInfo = await memberInfo.findOne({
                        userID: target.id,
                    });

                    if (!userInfo) {
                        const infoErrorComponents = [
                            new ContainerBuilder().addTextDisplayComponents(
                                new TextDisplayBuilder().setContent(
                                    "❌ ไม่พบข้อมูลของสมาชิกคนนี้"
                                )
                            ),
                        ];

                        return interaction.editReply({
                            components: infoErrorComponents,
                            flags: MessageFlags.IsComponentsV2,
                        });
                    }

                    const infoComponent = [
                        new ContainerBuilder()
                            .addSectionComponents(
                                new SectionBuilder()
                                    .setThumbnailAccessory(
                                        new ThumbnailBuilder().setURL(
                                            target.displayAvatarURL({
                                                extension: "png",
                                            })
                                        )
                                    )
                                    .addTextDisplayComponents(
                                        new TextDisplayBuilder().setContent(
                                            [
                                                `# <@${target.id}>`,
                                                `ᅠ`,
                                                `👤 ชื่อ : \`\`${
                                                    userInfo.nickname || "-"
                                                }\`\``,
                                                `🌿 สาขา : \`\`${
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

                    return interaction.editReply({
                        components: infoComponent,
                        flags: MessageFlags.IsComponentsV2,
                    });
                } catch (error) {
                    console.error("[contextMenuResponse] error:", error);
                }
            default:
                return;
        }
    },
};
