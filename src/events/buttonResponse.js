const {
    Events,
    MessageFlags,
    ChannelType,
    PermissionsBitField,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ContainerBuilder,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} = require("discord.js");
const { roles, channels, tags } = require("../utils/config.json");
const memberInfo = require("../models/users.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const channel = interaction.channel;
        const user = interaction.user;
        const unixTime = Math.floor(Date.now() / 1000);

        if (!interaction.isButton()) return;

        // verification buttons
        if (interaction.customId.startsWith("VERIFY_USER-")) {
            try {
                const userId = interaction.customId.split("-")[1];
                const member = await interaction.guild.members
                    .fetch(userId)
                    .catch(() => null);

                if (!member) {
                    return interaction.reply({
                        content: `❌ ไม่พบผู้ใช้ <@${userId}> ในเซิร์ฟเวอร์`,
                        flags: MessageFlags.Ephemeral,
                    });
                }

                const editComponents = [
                    new ContainerBuilder().addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            `✅ อนุมัติการเข้าร่วม <@${userId}> แล้ว`
                        )
                    ),
                ];

                await interaction.update({
                    components: editComponents,
                    flags: MessageFlags.IsComponentsV2,
                });

                const joinRole = interaction.guild.roles.cache.find(
                    (role) => role.id === roles.unauthorized
                );
                const verifyRole = interaction.guild.roles.cache.find(
                    (role) => role.id === roles.member
                );
                await member.roles.add(verifyRole);
                await member.roles.remove(joinRole);

                await memberInfo.updateOne(
                    { userID: userId },
                    { isVerified: true }
                );

                const dmComponents = [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(
                                `-# <t:${unixTime}:f>\n# ✅ **คุณผ่านการอนุมัติ !**\nยินดีด้วย คุณผ่านการคัดเลือกในการเข้าร่วมเซิร์ฟเวอร์เป็นที่เรียบร้อย\nขอต้อนรับเข้าสู่เซิร์ฟเวอร์ของคณะวิศวกรรม Engineering จากมหาวิทยาลัยพระจอมเกล้าพระนครเหนือ !\n\nคุณสามารถเข้าไปพูดคุย / แชร์เนื้อหาเรียน / เล่นเกม และอื่นๆ ด้วยกันกับทุกคนในเซิร์ฟเวอร์ได้เลย\nแล้วอย่าลืมอ่านกฎของเซิร์ฟเวอร์ด้วยนะ ขอให้สนุก!\n\n-# ข้อมูลการลงทะเบียนของคุณจะถูกบันทึกไว้ในฐานข้อมูลของเรา คุณจะไม่ต้องทำการยืนยันตัวตนใหม่อีกต่อไป หากต้องการแก้ไขข้อมูลโปรไฟล์ของคุณ สามารถใช้งานคำสั่ง /profile เพื่อปรับแต่งข้อมูลได้ทันที`
                            )
                        )
                        .addSeparatorComponents(
                            new SeparatorBuilder()
                                .setSpacing(SeparatorSpacingSize.Small)
                                .setDivider(true)
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Link)
                                    .setLabel("ไปที่แชทหลัก")
                                    .setURL(
                                        "https://discord.com/channels/1375011227402637404/1375013433581244517"
                                    )
                            )
                        ),
                ];

                return member.send({
                    components: dmComponents,
                    flags: MessageFlags.IsComponentsV2,
                });
            } catch (error) {
                console.error("[verify user] error:", error);
            }
        } else if (interaction.customId.startsWith("DENY_USER-")) {
            try {
                const userId = interaction.customId.split("-")[1];
                const member = await interaction.guild.members
                    .fetch(userId)
                    .catch(() => null);

                if (!member) {
                    return interaction.reply({
                        content: `❌ ไม่พบผู้ใช้ <@${userId}> ในเซิร์ฟเวอร์`,
                        flags: MessageFlags.Ephemeral,
                    });
                }

                const editComponents = [
                    new ContainerBuilder().addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(
                            `❌ ปฎิเสธการเข้าร่วม <@${userId}> แล้ว`
                        )
                    ),
                ];

                await interaction.update({
                    components: editComponents,
                    flags: MessageFlags.IsComponentsV2,
                });

                const dmComponents = [
                    new ContainerBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(
                                `-# <t:${unixTime}:f>\n# ⚠️ **คุณไม่ผ่านการอนุมัติ !**\nขออภัย ขณะนี้คุณไม่ผ่านการอนุมัติดการเข้าร่วมเซิร์ฟเวอร์ของเรา เนื่องจากอาจมีคุณสมบัติที่ไม่ตรงกับวัตถุประสงค์นัก\n\nหากคิดว่านี่อาจเป็นความผิดพลาด สามารถส่งคำขอผ่านการยืนยันตัวตนเข้ามาใหม่ \nหรือ กรุณาติดต่อทีมงานโดยทันที`
                            )
                        )
                        .addSeparatorComponents(
                            new SeparatorBuilder()
                                .setSpacing(SeparatorSpacingSize.Small)
                                .setDivider(true)
                        )
                        .addActionRowComponents(
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Link)
                                    .setLabel("ไปลงทะเบียนใหม่")
                                    .setURL(
                                        "https://discord.com/channels/1375011227402637404/1396186325048098876"
                                    ),
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Link)
                                    .setLabel("ติดต่อแอดมิน")
                                    .setURL(
                                        "https://discordapp.com/users/824442267318222879/"
                                    )
                            )
                        ),
                ];

                return member.send({
                    components: dmComponents,
                    flags: MessageFlags.IsComponentsV2,
                });
            } catch (error) {
                console.error("[deny user] error:", error);
            }
        }

        switch (interaction.customId) {
            // support ticket
            case "create_support_ticket": {
                try {
                    const thread = await channel.threads.create({
                        name: `${interaction.user.username}'s Chat`,
                        type: ChannelType.PrivateThread,
                        reason: interaction.user.id,
                    });

                    await interaction.reply({
                        content: `✅ <@${interaction.user.id}> สร้างทิคเก็ตสำเร็จ กรุณาอ่านข้อความที่ ${thread.url}`,
                        flags: MessageFlags.Ephemeral,
                    });

                    await thread.members.add(interaction.user.id);
                    await thread.setInvitable(false);

                    const ticketComponents = [
                        new ContainerBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder().setContent(
                                    `<t:${unixTime}:f>\n\n- อธิบายปัญหาของคุณให้ชัดเจน ยิ่งละเอียดยิ่งดี!\n- กรุณาแนบรูปภาพ หรือวิดีโอประกอบเพื่อทำให้เข้าใจปัญหาได้ดียิ่งขึ้น\n- ทดลองค้นหาปัญหาใน Google หรือประวัติข้อความในเซิร์ฟเวอร์เพื่อไม่ให้ซ้ำคำถามเก่า\n- หากแก้ปัญหาได้แล้ว กรุณากดปุ่ม \"แก้ไขแล้ว\"`
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
                                        .setLabel("แก้ไขแล้ว")
                                        .setCustomId("close_support_ticket")
                                )
                            ),
                    ];

                    await thread.send({
                        components: ticketComponents,
                        flags: MessageFlags.IsComponentsV2,
                    });

                    const ticketNotiChannel =
                        interaction.client.channels.cache.get(channels.modlogs);
                    const ticketNotiEmbed = new EmbedBuilder()
                        .setDescription(
                            `### 📫 **มีการเปิดทิคเก็ตใหม่โดย <@${interaction.user.id}>**\n🕑 เวลา  : <t:${unixTime}:f>\n📎 ลิงก์ข้อความ : ${thread.url}`
                        )
                        .setColor("#00f556");

                    await ticketNotiChannel.send({
                        content: "@everyone",
                        embeds: [ticketNotiEmbed],
                    });
                } catch (error) {
                    console.error("[create support ticket] error:", error);
                }

                break;
            }
            case "close_support_ticket": {
                try {
                    await interaction.reply({
                        content: `🗑️ <@${user.id}> ปิดทิคเก็ตนี้เรียบร้อยแล้ว กำลังจะถูกลบในอีก 3 วินาที`,
                    });

                    setTimeout(async () => {
                        try {
                            await channel.delete();

                            const ticketNotiChannel =
                                interaction.client.channels.cache.get(
                                    channels.modlogs
                                );
                            const ticketNotiEmbed = new EmbedBuilder()
                                .setDescription(
                                    `### 🔒 **ทิคเก็ตของ <@${interaction.user.id}> ถูกปิดเรียบร้อยแล้ว**\n🕑 เวลา  : <t:${unixTime}:f>\n👤 ผู้ดำเนินการ : <@${interaction.user.id}>`
                                )
                                .setColor("#f50031");

                            await ticketNotiChannel.send({
                                embeds: [ticketNotiEmbed],
                            });
                        } catch (err) {
                            console.error("Error deleting channel:", err);
                        }
                    }, 3000);
                } catch (error) {
                    console.error("[close support ticket] error:", error);
                }

                break;
            }

            // profile
            case "setup_profile": {
                try {
                    const modal = new ModalBuilder()
                        .setCustomId("profile_setup_modal")
                        .setTitle("ตั้งค่าโปรไฟล์")
                        .addComponents(
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId("setupNickname")
                                    .setLabel("ชื่อเล่น")
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                            ),
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId("setupDepartment")
                                    .setLabel("สาขาวิชา")
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                            ),
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId("setupInstagram")
                                    .setLabel("ชื่อผู้ใช้ Instagram")
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(false)
                            )
                        );

                    await interaction.showModal(modal);
                } catch (error) {
                    console.error("[setup profile] error:", error);
                }
            }
            case "edit_profile": {
                try {
                    const userData = await memberInfo.findOne({
                        userID: user.id,
                    });

                    const modal = new ModalBuilder()
                        .setCustomId("profile_edit_modal")
                        .setTitle("แก้ไขโปรไฟล์")
                        .addComponents(
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId("profileNickname")
                                    .setLabel("ชื่อเล่น")
                                    .setStyle(TextInputStyle.Short)
                                    .setPlaceholder(`${userData.nickname}`)
                                    .setRequired(false)
                            ),
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId("profileDepartment")
                                    .setLabel("สาขาวิชา")
                                    .setStyle(TextInputStyle.Short)
                                    .setPlaceholder(`${userData.department}`)
                                    .setRequired(false)
                            ),
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId("profileInstagram")
                                    .setLabel(
                                        "ชื่อผู้ใช้ Instagram (พิมพ์ !del เพื่อลบ)"
                                    )
                                    .setStyle(TextInputStyle.Short)
                                    .setPlaceholder(
                                        `${
                                            userData.instagram ||
                                            "ยังไม่มีข้อมูล"
                                        }`
                                    )
                                    .setRequired(false)
                            )
                        );

                    await interaction.showModal(modal);
                } catch (error) {
                    console.error("[edit profile] error:", error);
                }

                break;
            }

            // verification
            case "open_verification": {
                try {
                    const components = [
                        new ContainerBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder().setContent(
                                    "## **❓ กรุณาเลือกรูปแบบที่ตรงกับตัวคุณ**"
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
                                        .setLabel("เป็นนักศึกษาจากคณะ")
                                        .setCustomId("engMember"),
                                    new ButtonBuilder()
                                        .setStyle(ButtonStyle.Secondary)
                                        .setLabel("เป็นนักศึกษาจากคณะอื่น")
                                        .setCustomId("fromUni"),
                                    new ButtonBuilder()
                                        .setStyle(ButtonStyle.Secondary)
                                        .setLabel("เป็นบุคคลภายนอก")
                                        .setCustomId("fromOutside")
                                )
                            ),
                    ];

                    await interaction.reply({
                        components: components,
                        flags:
                            MessageFlags.Ephemeral |
                            MessageFlags.IsComponentsV2,
                    });
                } catch (error) {
                    console.error("[open verification] error:", error);
                }

                break;
            }
            case "engMember": {
                try {
                    const checkData = await memberInfo.findOne({
                        userID: interaction.user.id,
                    });

                    if (checkData) {
                        return interaction.reply({
                            content: `❌ <@${interaction.user.id}> คุณส่งข้อมูลยืนยันตัวตนไปแล้ว กรุณารอการอนุมัติจากทีมงาน`,
                            flags: MessageFlags.Ephemeral,
                        });
                    }

                    const modal = new ModalBuilder()
                        .setCustomId("verification_modal")
                        .setTitle("ยืนยันตัวตน")
                        .addComponents(
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId("userNickName")
                                    .setLabel("ชื่อเล่น")
                                    .setStyle(TextInputStyle.Short)
                                    .setPlaceholder("เกม")
                                    .setRequired(true)
                            ),
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId("studentIdNumber")
                                    .setLabel("รหัสนักศึกษา 13 หลัก")
                                    .setStyle(TextInputStyle.Short)
                                    .setPlaceholder("68xxxxxxxxxxx")
                                    .setMaxLength(13)
                                    .setMinLength(13)
                                    .setRequired(true)
                            ),
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId("departmentName")
                                    .setLabel("สาขาวิชา")
                                    .setStyle(TextInputStyle.Short)
                                    .setPlaceholder("วิศวกรรมคอมพิวเตอร์")
                                    .setRequired(true)
                            ),
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId("instagramUsername")
                                    .setLabel("ชื่อผู้ใช้ Instagram")
                                    .setStyle(TextInputStyle.Short)
                                    .setPlaceholder("sillyqwrts")
                                    .setRequired(false)
                            )
                        );

                    await interaction.showModal(modal);
                } catch (error) {
                    console.error("[engMember] error :", error);
                }

                break;
            }
            case "fromUni": {
                try {
                    const joinRole = interaction.guild.roles.cache.find(
                        (role) => role.id === roles.unauthorized
                    );
                    const verifyRole = interaction.guild.roles.cache.find(
                        (role) => role.id === roles.visitor
                    );
                    await interaction.member.roles.add(verifyRole);
                    await interaction.member.roles.remove(joinRole);

                    const replyEmbed = new EmbedBuilder()
                        .setDescription(
                            `✅ <@${interaction.user.id}> ยืนยันตัวตนเสร็จแล้ว!`
                        )
                        .setColor("#33ff70");

                    const response = await interaction.reply({
                        embeds: [replyEmbed],
                    });

                    setTimeout(async () => {
                        await response.delete();
                    }, 3000);

                    break;
                } catch (error) {
                    console.error("[engVisitor] error:", error);
                }
                break;
            }
            case "fromOutside": {
                try {
                    const joinRole = interaction.guild.roles.cache.find(
                        (role) => role.id === roles.unauthorized
                    );
                    const verifyRole = interaction.guild.roles.cache.find(
                        (role) => role.id === roles.visitor
                    );
                    await interaction.member.roles.add(verifyRole);
                    await interaction.member.roles.remove(joinRole);

                    const replyEmbed = new EmbedBuilder()
                        .setDescription(
                            `✅ <@${interaction.user.id}> ยืนยันตัวตนเสร็จแล้ว!`
                        )
                        .setColor("#33ff70");

                    const response = await interaction.reply({
                        embeds: [replyEmbed],
                    });

                    setTimeout(async () => {
                        await response.delete();
                    }, 3000);

                    break;
                } catch (error) {
                    console.error("[engVisitor] error:", error);
                }
                break;
            }

            // close threads
            case "thread_problem_solved": {
                const tagID = tags.resolved;

                try {
                    if (
                        !(
                            user.id === interaction.channel.ownerId ||
                            interaction.member.permissions.has(
                                PermissionsBitField.Flags.ManageChannels
                            )
                        )
                    ) {
                        await interaction.reply({
                            content: `❌ <@${user.id}> ไม่สามารถดำเนินการได้ เนื่องจากคุณไม่ใช่เจ้าของโพสต์`,
                            flags: MessageFlags.Ephemeral,
                        });
                        return;
                    }

                    if (
                        channel.type === ChannelType.PublicThread ||
                        channel.type === ChannelType.PrivateThread
                    ) {
                        await interaction.reply({
                            content: `✅ <@${user.id}> ทำเครื่องหมายแก้ไขปัญหาแล้วสำเร็จ `,
                            flags: MessageFlags.Ephemeral,
                        });

                        const existedTags = channel.appliedTags;
                        const updatedTags = [
                            ...new Set([...existedTags, tagID]),
                        ];
                        await channel.setAppliedTags(updatedTags);
                        await channel.setLocked(true);
                    }
                } catch (error) {
                    console.error("[thread solved] error:", error);
                }

                break;
            }

            // default
            default:
                return;
        }
    },
};
