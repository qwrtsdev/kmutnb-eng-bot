const {
    Events,
    ChannelType,
    MessageFlags,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    ContainerBuilder,
    StringSelectMenuOptionBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
} = require("discord.js");
const { channels: channelIds } = require("../utils/config.json");

module.exports = {
    name: Events.VoiceStateUpdate,
    once: false,

    async execute(oldState, newState, interaction) {
        const protectedChannels = [
            channelIds.voiceRoom, // join to create
            "1375016012621156384", // 24/7 radio
            "1401913719503716423", // border
        ];

        try {
            if (
                (!oldState.channelId ||
                    oldState.channelId !== channelIds.voiceRoom) &&
                newState.channelId === channelIds.voiceRoom
            ) {
                try {
                    const channel = await newState.guild.channels.create({
                        name: `🔊・${newState.member.user.username}`,
                        type: ChannelType.GuildVoice,
                        parent: newState.channel.parent,
                    });

                    await newState.member.voice.setChannel(channel.id);

                    component = [
                        new ContainerBuilder()
                            .addMediaGalleryComponents(
                                new MediaGalleryBuilder().addItems(
                                    new MediaGalleryItemBuilder().setURL(
                                        "https://media.discordapp.net/attachments/1399430120443482213/1402317590834970654/eng-new.png?ex=68937987&is=68922807&hm=5a928ec9a36b584d1cabebfc01db99e986bfa5e58d30176603f1b6e16f0f01c9&=&format=webp&quality=lossless&width=1845&height=516"
                                    )
                                )
                            )
                            .addTextDisplayComponents(
                                new TextDisplayBuilder().setContent(
                                    `## **📄 Room Settings — ตั้งค่าห้องเสียง**\nᅠ\n<@${newState.member.id}> ยินดีต้อนรับเข้าสู่หน้าต่างการตั้งค่าห้องเสียง คุณสามารถปรับแต่งห้องของคุณได้อย่างใจต้องการที่นี่\n\n- ตัวเลือกที่มีไอคอน 👑 จำเป็นต้องมีบทบาท Server Booster (สำหรับผู้สนับสนุนเท่านั้น)\n- ฟีเจอร์นี้ยังไม่สามารถใช้งานได้เต็มที่ 100% ทำให้มีฟังก์ชั่นบางอย่างที่ยังทำงานได้ไม่สมบูรณ์\n\n-# หากพบปัญหาในการใช้งาน กรุณาติดต่อแอดมิน`
                                )
                            )
                            .addSeparatorComponents(
                                new SeparatorBuilder()
                                    .setSpacing(SeparatorSpacingSize.Large)
                                    .setDivider(true)
                            )
                            .addActionRowComponents(
                                new ActionRowBuilder().addComponents(
                                    new StringSelectMenuBuilder()
                                        .setCustomId(
                                            "voiceRoomSettings-" +
                                                newState.channelId +
                                                "-" +
                                                newState.member.id
                                        )
                                        .setPlaceholder("กรุณาคลิกเพื่อเลือก")
                                        .addOptions(
                                            new StringSelectMenuOptionBuilder()
                                                .setLabel("เปลี่ยนชื่อ 🔒")
                                                .setValue("vcRename")
                                                .setDescription(
                                                    "เปลี่ยนชื่อห้องที่ใช้แสดงผล"
                                                )
                                                .setEmoji({
                                                    name: "✏️",
                                                }),
                                            new StringSelectMenuOptionBuilder()
                                                .setLabel("ปรับจำนวน 🔒")
                                                .setValue("vcLimit")
                                                .setDescription(
                                                    "ตั้งค่าจำนวนสูงสุดที่สมาชิกสามารถเข้าร่วมห้องได้"
                                                )
                                                .setEmoji({
                                                    name: "👤",
                                                }),
                                            new StringSelectMenuOptionBuilder()
                                                .setLabel("ล็อคห้อง")
                                                .setValue("vcLock")
                                                .setDescription(
                                                    "ล็อคห้องของคุณเป็นส่วนตัว และจะไม่มีใครสามารถเข้าได้"
                                                )
                                                .setEmoji({
                                                    name: "🔒",
                                                }),
                                            new StringSelectMenuOptionBuilder()
                                                .setLabel("ปลดล็อคห้อง")
                                                .setValue("vcUnlock")
                                                .setDescription(
                                                    "ตั้งห้องของคุณเป็นสาธารณะ และสามาชิกคนอื่นสามารถเข้าร่วมได้"
                                                )
                                                .setEmoji({
                                                    name: "🔑",
                                                }),
                                            new StringSelectMenuOptionBuilder()
                                                .setLabel("เตะผู้ใช้ 🔒")
                                                .setValue("vcKick")
                                                .setDescription(
                                                    "นำผู้ใช้ที่คุณไม่ต้องการออกจากห้อง"
                                                )
                                                .setEmoji({
                                                    name: "🚫",
                                                }),
                                            new StringSelectMenuOptionBuilder()
                                                .setLabel("เคลมห้อง 👑🔒")
                                                .setValue("vcClaim")
                                                .setDescription(
                                                    "รับสิทธิ์การเป็นเจ้าของห้องแทน เมื่อเจ้าของห้องไม่อยู่"
                                                )
                                                .setEmoji({
                                                    name: "🛡️",
                                                }),
                                            new StringSelectMenuOptionBuilder()
                                                .setLabel("คุณภาพเสียงสูง 👑🔒")
                                                .setValue(
                                                    "33be61ec53d64659cf3c746765c4805f"
                                                )
                                                .setDescription(
                                                    "ปรับห้องเป็นคุณภาพเสียงสูงสุด เพื่อความคมชัด"
                                                )
                                                .setEmoji({
                                                    name: "🎵",
                                                })
                                        )
                                )
                            ),
                    ];

                    channel.send({
                        components: component,
                        flags: MessageFlags.IsComponentsV2,
                    });
                } catch (error) {
                    console.error("[autoVC - create] error :", error);
                }
            }

            if (oldState.channel) {
                if (
                    !protectedChannels.includes(oldState.channel.id) &&
                    oldState.channel.members.size === 0
                ) {
                    try {
                        await oldState.channel.delete();
                    } catch (error) {
                        console.error("[autoVC - remove] error :", error);
                    }
                }
            }
        } catch (error) {
            console.error("[autoVC] error :", error);
        }
    },
};
